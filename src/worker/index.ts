import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { getCookie, setCookie } from "hono/cookie";
import z from "zod";
import {
  exchangeCodeForSessionToken,
  getOAuthRedirectUrl,
  authMiddleware,
  deleteSession,
  MOCHA_SESSION_TOKEN_COOKIE_NAME,
} from "@getmocha/users-service/backend";
import bcrypt from "bcryptjs";
import { AdminLoginSchema, StudentCreateSchema, StudentUpdateSchema } from "@/shared/types";

const AdminPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

type Variables = {
  user?: any;
  admin?: { id: number; email: string; isAdmin: boolean };
};

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CORS middleware for all routes
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (c.req.method === "OPTIONS") {
    return c.text("");
  }
  
  await next();
});

// Google OAuth endpoints for students
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60, // 60 days
  });

  return c.json({ success: true }, 200);
});

// Get current user and create student record if needed
app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  // Check if student record exists, create if not
  const existingStudent = await c.env.DB.prepare(
    "SELECT * FROM students WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!existingStudent) {
    // Create student record
    await c.env.DB.prepare(
      "INSERT INTO students (mocha_user_id, email, name, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(
      user.id,
      user.email,
      user.google_user_data.name || user.google_user_data.given_name || "Student"
    ).run();
    
    // Return user data with null college_name for new students
    return c.json({ ...user, college_name: null });
  }

  // Return user data with college_name from database
  return c.json({ ...user, college_name: existingStudent.college_name });
});

// Update user profile (college name)
app.put("/api/users/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  
  if (!user) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  if (!body.college_name || typeof body.college_name !== "string") {
    return c.json({ error: "College name is required" }, 400);
  }

  // Update student record with college name
  await c.env.DB.prepare(
    "UPDATE students SET college_name = ?, updated_at = datetime('now') WHERE mocha_user_id = ?"
  ).bind(body.college_name.trim(), user.id).run();

  return c.json({ success: true });
});

app.get('/api/logout', async (c) => {
  const sessionToken = getCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME);

  if (typeof sessionToken === 'string') {
    await deleteSession(sessionToken, {
      apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
      apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
    });
  }

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Admin authentication
app.post("/api/admin/login", zValidator("json", AdminLoginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const admin = await c.env.DB.prepare(
    "SELECT * FROM admins WHERE email = ? AND is_admin = 1"
  ).bind(email).first();

  if (!admin || !bcrypt.compareSync(password, admin.password_hash as string)) {
    return c.json({ error: "Invalid Admin Credentials" }, 401);
  }

  // Create admin session token (simple approach for demo)
  const encodedToken = JSON.stringify({ id: admin.id, email: admin.email, isAdmin: true });
  
  setCookie(c, "admin_session", encodedToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none", 
    secure: true,
    maxAge: 8 * 60 * 60, // 8 hours
  });

  // Check if using default password
  const isDefaultPassword = bcrypt.compareSync("password", admin.password_hash as string);
  
  return c.json({ 
    success: true, 
    admin: { 
      id: admin.id, 
      email: admin.email, 
      name: admin.name,
      requiresPasswordChange: isDefaultPassword
    } 
  });
});

// Admin middleware
const adminAuthMiddleware = async (c: any, next: any) => {
  const adminSession = getCookie(c, "admin_session");
  
  if (!adminSession) {
    return c.json({ error: "Access Denied" }, 401);
  }

  try {
    const adminData = JSON.parse(adminSession);
    if (!adminData.isAdmin) {
      return c.json({ error: "Access Denied" }, 401);
    }
    c.set("admin", adminData as { id: number; email: string; isAdmin: boolean });
  } catch {
    return c.json({ error: "Access Denied" }, 401);
  }

  await next();
};

app.get("/api/admin/logout", async (c) => {
  setCookie(c, "admin_session", '', {
    httpOnly: true,
    path: '/',
    sameSite: 'none',
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true });
});

// Admin dashboard endpoints
app.get("/api/admin/stats", adminAuthMiddleware, async (c) => {
  const totalStudents = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM students"
  ).first();

  const newStudentsThisWeek = await c.env.DB.prepare(
    "SELECT COUNT(*) as count FROM students WHERE created_at >= datetime('now', '-7 days')"
  ).first();

  return c.json({
    total_students: totalStudents?.count || 0,
    new_students_this_week: newStudentsThisWeek?.count || 0,
  });
});

app.get("/api/admin/students", adminAuthMiddleware, async (c) => {
  const students = await c.env.DB.prepare(
    "SELECT id, email, name, college_name, created_at FROM students ORDER BY created_at DESC"
  ).all();

  return c.json({ students: students.results || [] });
});

app.post("/api/admin/students", adminAuthMiddleware, zValidator("json", StudentCreateSchema), async (c) => {
  const { email, name, college_name } = c.req.valid("json");

  const result = await c.env.DB.prepare(
    "INSERT INTO students (mocha_user_id, email, name, college_name, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))"
  ).bind(`manual-${Date.now()}`, email, name, college_name || null).run();

  return c.json({ success: true, id: result.meta.last_row_id });
});

app.put("/api/admin/students/:id", adminAuthMiddleware, zValidator("json", StudentUpdateSchema), async (c) => {
  const id = c.req.param("id");
  const updates = c.req.valid("json");

  const setClause = Object.keys(updates).map(key => `${key} = ?`).join(", ");
  const values = Object.values(updates);

  await c.env.DB.prepare(
    `UPDATE students SET ${setClause}, updated_at = datetime('now') WHERE id = ?`
  ).bind(...values, id).run();

  return c.json({ success: true });
});

app.delete("/api/admin/students/:id", adminAuthMiddleware, async (c) => {
  const id = c.req.param("id");

  await c.env.DB.prepare("DELETE FROM students WHERE id = ?").bind(id).run();

  return c.json({ success: true });
});

// Admin password change endpoint
app.put("/api/admin/change-password", adminAuthMiddleware, zValidator("json", AdminPasswordChangeSchema), async (c) => {
  const { currentPassword, newPassword } = c.req.valid("json");
  const admin = c.get("admin");

  if (!admin) {
    return c.json({ error: "Access Denied" }, 401);
  }

  // Get current admin data from database
  const adminData = await c.env.DB.prepare(
    "SELECT * FROM admins WHERE id = ?"
  ).bind(admin.id).first();

  if (!adminData || !bcrypt.compareSync(currentPassword, adminData.password_hash as string)) {
    return c.json({ error: "Current password is incorrect" }, 400);
  }

  // Hash new password and update
  const newPasswordHash = bcrypt.hashSync(newPassword, 10);
  await c.env.DB.prepare(
    "UPDATE admins SET password_hash = ?, updated_at = datetime('now') WHERE id = ?"
  ).bind(newPasswordHash, admin.id).run();

  return c.json({ success: true });
});

export default app;

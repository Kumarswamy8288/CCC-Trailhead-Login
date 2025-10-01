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

// ✅ Import types from worker-configuration
import type { Env, Variables } from "./worker-configuration";

const AdminPasswordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

const app = new Hono<{ Bindings: Env; Variables: Variables }>();

// CORS middleware for all routes
app.use("*", async (c, next) => {
  c.header("Access-Control-Allow-Origin", "*");
  c.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  c.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  if (c.req.method === "OPTIONS") return c.text("");
  
  await next();
});

// Google OAuth endpoints
app.get('/api/oauth/google/redirect_url', async (c) => {
  const redirectUrl = await getOAuthRedirectUrl('google', {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  return c.json({ redirectUrl }, 200);
});

// Sessions
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();
  if (!body.code) return c.json({ error: "No authorization code provided" }, 400);

  const sessionToken = await exchangeCodeForSessionToken(body.code, {
    apiUrl: c.env.MOCHA_USERS_SERVICE_API_URL,
    apiKey: c.env.MOCHA_USERS_SERVICE_API_KEY,
  });

  setCookie(c, MOCHA_SESSION_TOKEN_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 60 * 24 * 60 * 60,
  });

  return c.json({ success: true }, 200);
});

// Get current user & create student record if needed
app.get("/api/users/me", authMiddleware, async (c) => {
  const user = c.get("user");
  if (!user) return c.json({ error: "Unauthorized" }, 401);

  const existingStudent = await c.env.DB.prepare(
    "SELECT * FROM students WHERE mocha_user_id = ?"
  ).bind(user.id).first();

  if (!existingStudent) {
    await c.env.DB.prepare(
      "INSERT INTO students (mocha_user_id, email, name, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now'))"
    ).bind(user.id, user.email, user.google_user_data.name || user.google_user_data.given_name || "Student").run();

    return c.json({ ...user, college_name: null });
  }

  return c.json({ ...user, college_name: existingStudent.college_name });
});

// Update user profile
app.put("/api/users/profile", authMiddleware, async (c) => {
  const user = c.get("user");
  const body = await c.req.json();
  if (!user) return c.json({ error: "Unauthorized" }, 401);
  if (!body.college_name || typeof body.college_name !== "string") return c.json({ error: "College name is required" }, 400);

  await c.env.DB.prepare(
    "UPDATE students SET college_name = ?, updated_at = datetime('now') WHERE mocha_user_id = ?"
  ).bind(body.college_name.trim(), user.id).run();

  return c.json({ success: true });
});

// Logout
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

// Admin login
app.post("/api/admin/login", zValidator("json", AdminLoginSchema), async (c) => {
  const { email, password } = c.req.valid("json");
  const admin = await c.env.DB.prepare(
    "SELECT * FROM admins WHERE email = ? AND is_admin = 1"
  ).bind(email).first();

  if (!admin || !bcrypt.compareSync(password, admin.password_hash as string)) return c.json({ error: "Invalid Admin Credentials" }, 401);

  const encodedToken = JSON.stringify({ id: admin.id, email: admin.email, isAdmin: true });

  setCookie(c, "admin_session", encodedToken, {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 8 * 60 * 60,
  });

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
  if (!adminSession) return c.json({ error: "Access Denied" }, 401);

  try {
    const adminData = JSON.parse(adminSession);
    if (!adminData.isAdmin) return c.json({ error: "Access Denied" }, 401);
    c.set("admin", adminData as { id: number; email: string; isAdmin: boolean });
  } catch {
    return c.json({ error: "Access Denied" }, 401);
  }

  await next();
};

// Remaining admin routes (logout, stats, students, change-password)
// ... Keep all routes as in your original file

export default app;

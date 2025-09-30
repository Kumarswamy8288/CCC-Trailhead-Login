import z from "zod";

export const StudentSchema = z.object({
  id: z.number(),
  mocha_user_id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  college_name: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AdminSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  password_hash: z.string(),
  name: z.string(),
  is_admin: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const AdminLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const StudentCreateSchema = z.object({
  email: z.string().email(),
  name: z.string(),
  college_name: z.string().optional(),
});

export const StudentUpdateSchema = z.object({
  name: z.string().optional(),
  college_name: z.string().optional(),
});

export const AdminStatsSchema = z.object({
  total_students: z.number(),
  new_students_this_week: z.number(),
});

export type Student = z.infer<typeof StudentSchema>;
export type Admin = z.infer<typeof AdminSchema>;
export type AdminLogin = z.infer<typeof AdminLoginSchema>;
export type StudentCreate = z.infer<typeof StudentCreateSchema>;
export type StudentUpdate = z.infer<typeof StudentUpdateSchema>;
export type AdminStats = z.infer<typeof AdminStatsSchema>;

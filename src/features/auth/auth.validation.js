import { z } from "zod";
import { AUTH_CONFIG } from "./auth.config.js";

const email = z
  .email("Enter a valid email address")
  .transform((value) => value.toLowerCase());

export const signupSchema = z.object({
  name: z
    .string("Name is required")
    .trim()
    .min(AUTH_CONFIG.NAME_MIN, `Name must be at least ${AUTH_CONFIG.NAME_MIN} characters`)
    .max(AUTH_CONFIG.NAME_MAX, `Name must be at most ${AUTH_CONFIG.NAME_MAX} characters`),
  email,
  password: z
    .string("Password is required")
    .min(AUTH_CONFIG.PASSWORD_MIN, `Password must be at least ${AUTH_CONFIG.PASSWORD_MIN} characters`)
    .max(AUTH_CONFIG.PASSWORD_MAX, `Password must be at most ${AUTH_CONFIG.PASSWORD_MAX} characters`),
});

export const loginSchema = z.object({
  email,
  password: z.string("Password is required").min(1, "Password is required"),
});
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../shared/config/env.js";
import { AppError } from "../../shared/utils/AppError.js";
import { AUTH_CONFIG } from "./auth.config.js";
import { User } from "./user.model.js";

function createToken(userId) {
  return jwt.sign({ sub: String(userId) }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
}

export async function signupUser({ name, email, password }) {
  const existing = await User.findOne({ email });
  if (existing) throw AppError("Email already registered", 409);

  const hashed = await bcrypt.hash(password, AUTH_CONFIG.SALT_ROUNDS);
  const user = await User.create({ name, email, password: hashed });

  return { user, token: createToken(user._id) };
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  const passwordMatches = user && (await bcrypt.compare(password, user.password));
  if (!passwordMatches) throw AppError("Invalid email or password", 401);

  return { user, token: createToken(user._id) };
}

export async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw AppError("User not found", 401);
  return user;
}
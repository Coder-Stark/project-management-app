import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(AppError("Authentication required", 401));
  }

  let payload;
  try {
    payload = jwt.verify(token, env.JWT_SECRET);
  } catch {
    return next(AppError("Invalid or expired token", 401));
  }

  req.user = { id: payload.sub };
  next();
}
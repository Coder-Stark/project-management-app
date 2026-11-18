import { signupUser, loginUser, getCurrentUser } from "./auth.service.js";

export async function signup(req, res) {
  const result = await signupUser(req.validated.body);
  res.status(201).json(result);
}

export async function login(req, res) {
  const result = await loginUser(req.validated.body);
  res.json(result);
}

export async function me(req, res) {
  const user = await getCurrentUser(req.user.id);
  res.json({ user });
}
import { Router } from "express";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";
import { signupSchema, loginSchema } from "./auth.validation.js";
import { signup, login, me } from "./auth.controller.js";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);
router.get("/me", requireAuth, me);

export default router;
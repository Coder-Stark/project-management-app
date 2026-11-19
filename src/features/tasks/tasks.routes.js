import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import { projectIdParamSchema } from "../projects/projects.validation.js";
import { createTaskSchema, updateTaskSchema, taskParamsSchema } from "./tasks.validation.js";
import { list, create, update, remove } from "./tasks.controller.js";

// mergeParams lets this router read :projectId from the URL it is mounted on.
const router = Router({ mergeParams: true });

router.use(requireAuth);

router.get("/", validate(projectIdParamSchema, "params"), list);
router.post("/", validate(projectIdParamSchema, "params"), validate(createTaskSchema), create);
router.patch("/:taskId", validate(taskParamsSchema, "params"), validate(updateTaskSchema), update);
router.delete("/:taskId", validate(taskParamsSchema, "params"), remove);

export default router;
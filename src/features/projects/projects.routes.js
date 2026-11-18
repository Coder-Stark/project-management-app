import { Router } from "express";
import { requireAuth } from "../../shared/middlewares/auth.middleware.js";
import { validate } from "../../shared/middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from "./projects.validation.js";
import { list, create, getOne, update, remove } from "./projects.controller.js";

const router = Router();

router.use(requireAuth);

router.get("/", list);
router.post("/", validate(createProjectSchema), create);
router.get("/:projectId", validate(projectIdParamSchema, "params"), getOne);
router.patch(
  "/:projectId",
  validate(projectIdParamSchema, "params"),
  validate(updateProjectSchema),
  update
);
router.delete("/:projectId", validate(projectIdParamSchema, "params"), remove);

export default router;
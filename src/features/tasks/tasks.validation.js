import { z } from "zod";
import { projectIdParamSchema } from "../projects/projects.validation.js";
import { SORT_ORDERS, TASK_CONFIG, TASK_SORT_FIELDS, TASK_STATUSES } from "./tasks.config.js";

const title = z
  .string("Title is required")
  .trim()
  .min(1, "Title is required")
  .max(TASK_CONFIG.TITLE_MAX, `Title must be at most ${TASK_CONFIG.TITLE_MAX} characters`);

const description = z
  .string("Description must be text")
  .trim()
  .max(
    TASK_CONFIG.DESCRIPTION_MAX,
    `Description must be at most ${TASK_CONFIG.DESCRIPTION_MAX} characters`
  );

const status = z.enum(TASK_STATUSES, "Status must be todo, in-progress or done");

// "2026-12-05" becomes a Date. null is allowed so the due date can be cleared.
const dueDate = z.iso
  .date("Due date must be a valid date (YYYY-MM-DD)")
  .transform((value) => new Date(value))
  .nullable();

export const createTaskSchema = z.object({
  title,
  description: description.optional(),
  status: status.optional(),
  dueDate: dueDate.optional(),
});

export const updateTaskSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
    status: status.optional(),
    dueDate: dueDate.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Send at least one field to update",
  });

export const taskParamsSchema = projectIdParamSchema.extend({
  taskId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task id"),
});

export const listTasksQuerySchema = z.object({
  status: status.optional(),
  sortBy: z.enum(TASK_SORT_FIELDS, "Sort field must be createdAt or dueDate").default("createdAt"),
  order: z.enum(SORT_ORDERS, "Order must be asc or desc").default("desc"),
});
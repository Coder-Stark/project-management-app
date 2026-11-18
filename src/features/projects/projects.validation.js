import { z } from "zod";
import { PROJECT_CONFIG } from "./projects.config.js";

const title = z
  .string("Title is required")
  .trim()
  .min(1, "Title is required")
  .max(PROJECT_CONFIG.TITLE_MAX, `Title must be at most ${PROJECT_CONFIG.TITLE_MAX} characters`);

const description = z
  .string("Description must be text")
  .trim()
  .max(
    PROJECT_CONFIG.DESCRIPTION_MAX,
    `Description must be at most ${PROJECT_CONFIG.DESCRIPTION_MAX} characters`
  );

export const createProjectSchema = z.object({
  title,
  description: description.optional(),
});

export const updateProjectSchema = z
  .object({
    title: title.optional(),
    description: description.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Send at least one field to update",
  });

export const projectIdParamSchema = z.object({
  projectId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid project id"),
});
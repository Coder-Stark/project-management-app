import { AppError } from "../../shared/utils/AppError.js";
import { Project } from "./project.model.js";

export async function findOwnedProject(userId, projectId) {
  const project = await Project.findOne({ _id: projectId, owner: userId });
  if (!project) throw AppError("Project not found", 404);
  return project;
}

export function listProjects(userId) {
  return Project.find({ owner: userId }).sort({ createdAt: -1 });
}

export function createProject(userId, { title, description }) {
  return Project.create({ owner: userId, title, description: description ?? "" });
}

export function getProject(userId, projectId) {
  return findOwnedProject(userId, projectId);
}

export async function updateProject(userId, projectId, updates) {
  const project = await Project.findOneAndUpdate(
    { _id: projectId, owner: userId },
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  );
  if (!project) throw AppError("Project not found", 404);
  return project;
}

export async function deleteProject(userId, projectId) {
  const result = await Project.deleteOne({ _id: projectId, owner: userId });
  if (result.deletedCount === 0) throw AppError("Project not found", 404);
}
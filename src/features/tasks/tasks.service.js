import { AppError } from "../../shared/utils/AppError.js";
import { findOwnedProject } from "../projects/projects.service.js";
import { Task } from "./task.model.js";
import { sortTasks } from "./tasks.sort.js";

export async function listTasks(userId, projectId, { status, sortBy, order }) {
  await findOwnedProject(userId, projectId);

  const filter = { project: projectId };
  if (status) filter.status = status;

  const tasks = await Task.find(filter);
  return sortTasks(tasks, sortBy, order);
}

export async function createTask(userId, projectId, data) {
  await findOwnedProject(userId, projectId);
  return Task.create({ ...data, project: projectId });
}

export async function updateTask(userId, projectId, taskId, updates) {
  await findOwnedProject(userId, projectId);

  const task = await Task.findOneAndUpdate(
    { _id: taskId, project: projectId },
    { $set: updates },
    { returnDocument: "after", runValidators: true }
  );
  if (!task) throw AppError("Task not found", 404);
  return task;
}

export async function deleteTask(userId, projectId, taskId) {
  await findOwnedProject(userId, projectId);

  const result = await Task.deleteOne({ _id: taskId, project: projectId });
  if (result.deletedCount === 0) throw AppError("Task not found", 404);
}
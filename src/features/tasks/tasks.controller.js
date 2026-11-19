import { listTasks, createTask, updateTask, deleteTask } from "./tasks.service.js";

export async function list(req, res) {
  const tasks = await listTasks(req.user.id, req.validated.params.projectId);
  res.json({ tasks });
}

export async function create(req, res) {
  const task = await createTask(
    req.user.id,
    req.validated.params.projectId,
    req.validated.body
  );
  res.status(201).json({ task });
}

export async function update(req, res) {
  const { projectId, taskId } = req.validated.params;
  const task = await updateTask(req.user.id, projectId, taskId, req.validated.body);
  res.json({ task });
}

export async function remove(req, res) {
  const { projectId, taskId } = req.validated.params;
  await deleteTask(req.user.id, projectId, taskId);
  res.status(204).send();
}
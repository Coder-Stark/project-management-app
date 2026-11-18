import {
  listProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
} from "./projects.service.js";

export async function list(req, res) {
  const projects = await listProjects(req.user.id);
  res.json({ projects });
}

export async function create(req, res) {
  const project = await createProject(req.user.id, req.validated.body);
  res.status(201).json({ project });
}

export async function getOne(req, res) {
  const project = await getProject(req.user.id, req.validated.params.projectId);
  res.json({ project });
}

export async function update(req, res) {
  const project = await updateProject(
    req.user.id,
    req.validated.params.projectId,
    req.validated.body
  );
  res.json({ project });
}

export async function remove(req, res) {
  await deleteProject(req.user.id, req.validated.params.projectId);
  res.status(204).send();
}
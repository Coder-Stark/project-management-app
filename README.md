# Mini Project Manager: Backend

REST API for a small project management app. Users sign up and log in, manage their own projects, and manage tasks inside each project (create, edit, delete, filter and sort).

- Frontend repository: `<frontend-repo-url>`
- Deployed API (optional): `<deployed-backend-url>`

## Tech stack

| Part | Technology |
|---|---|
| Runtime and framework | Node.js, Express 5 (ES modules) |
| Database | MongoDB with Mongoose 9 |
| Auth | JWT (jsonwebtoken), passwords hashed with bcryptjs |
| Validation | Zod 4 (request input and environment variables) |
| Dev tool | nodemon |

## Run the whole project (backend and frontend)

The backend and the frontend are two separate repositories. Start the backend first.

| Step | Where | Commands | Result |
|---|---|---|---|
| 1 | `backend` (this repo) | `npm install`, then `npm run dev` | API on `http://localhost:8080` |
| 2 | `frontend` | `npm install`, then `npm run dev` | App on `http://localhost:5173` |
| 3 | Browser | Open `http://localhost:5173` | Sign up, then create projects and tasks |

The setup details for this repo are below. The frontend setup is in the frontend README.

## Backend setup

### Prerequisites

- Node.js 20.19 or newer, and npm
- A MongoDB Atlas cluster (the free tier is enough). In Atlas, add your IP address under Network Access.

MongoDB must run as a replica set. Atlas does. A plain local `mongod` does not, and deleting a project would fail, because it uses a transaction.

### Steps

1. Clone the repository and install packages:

   ```bash
   git clone <backend-repo-url>
   cd backend
   npm install
   ```

2. Create your env file from the example:

   ```bash
   # macOS or Linux
   cp .env.example .env

   # Windows PowerShell
   Copy-Item .env.example .env
   ```

3. Open `.env` and fill in the values (see the table below). To generate a secret:

   ```bash
   node -p "require('crypto').randomBytes(32).toString('hex')"
   ```

4. Start the server:

   ```bash
   npm run dev
   ```

   You should see `MongoDB connected successfully` and `Server running on PORT: 8080`.

5. Check that it works: open `http://localhost:8080/api/health`. The answer is `{"status":"ok"}`.

### Environment variables

Sample file: `.env.example`

| Variable | Required | Description |
|---|---|---|
| `CLIENT_URL` | Yes | Frontend address allowed by CORS, for example `http://localhost:5173`. A trailing slash is removed. |
| `PORT` | No | Server port. Default `5000`. The example uses `8080`. |
| `MONGODB_URI` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign tokens, at least 16 characters |
| `JWT_EXPIRES_IN` | No | Token lifetime. Default `7d`. |

If a variable is missing or invalid, the server prints which one and exits.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the server with nodemon (restarts on file changes) |
| `npm start` | Starts the server with Node |

## API

All routes except health, signup and login need the header `Authorization: Bearer <token>`. The token comes from signup or login.

| Method | URL | Description |
|---|---|---|
| GET | `/api/health` | Health check |
| POST | `/api/auth/signup` | Create an account. Body: `name`, `email`, `password`. Returns `user` and `token`. |
| POST | `/api/auth/login` | Log in. Body: `email`, `password`. Returns `user` and `token`. |
| GET | `/api/auth/me` | The logged-in user |
| GET | `/api/projects` | My projects, newest first |
| POST | `/api/projects` | Create a project. Body: `title`, optional `description`. |
| GET | `/api/projects/:projectId` | One project |
| PATCH | `/api/projects/:projectId` | Edit `title` and/or `description` |
| DELETE | `/api/projects/:projectId` | Delete a project and all its tasks |
| GET | `/api/projects/:projectId/tasks` | Tasks of a project (filter and sort, see below) |
| POST | `/api/projects/:projectId/tasks` | Create a task |
| PATCH | `/api/projects/:projectId/tasks/:taskId` | Edit any of the task fields |
| DELETE | `/api/projects/:projectId/tasks/:taskId` | Delete a task |

Task body fields: `title`, `description` (optional), `status` (`todo`, `in-progress` or `done`, default `todo`), `dueDate` (optional, format `YYYY-MM-DD`, or `null` to clear it).

Task list query parameters (all optional):

| Parameter | Values | Default |
|---|---|---|
| `status` | `todo`, `in-progress`, `done` | all statuses |
| `sortBy` | `createdAt`, `dueDate` | `createdAt` |
| `order` | `asc`, `desc` | `desc` |

Example: `GET /api/projects/<projectId>/tasks?status=in-progress&sortBy=dueDate&order=asc`

Input limits:

| Field | Limit |
|---|---|
| Name | 2 to 50 characters |
| Password | 8 to 72 characters |
| Project and task title | up to 100 characters |
| Project description | up to 500 characters |
| Task description | up to 1000 characters |

Errors have one shape. Validation errors list each problem:

```json
{
  "message": "Validation failed",
  "details": [{ "path": "email", "message": "Enter a valid email address" }]
}
```

Status codes used: `400` invalid input, `401` missing or bad token or wrong login, `404` not found (including data that belongs to someone else), `409` email already registered.

## Implementation notes

- **Structure**: feature folders (`auth`, `projects`, `tasks`) with `routes`, `controller`, `service`, `model` and `validation` files. Controllers only handle HTTP. Business rules live in services.
- **Ownership**: the owner always comes from the token, never from the request body. Project queries include the owner. Tasks are reached only through a project the user owns. Someone else's project or task gives `404`, so the API does not reveal what exists.
- **Passwords**: hashed with bcryptjs, hidden from queries and removed from JSON responses. Wrong email and wrong password give the same message.
- **Validation**: Zod checks body, URL ids, query parameters and environment variables. Unknown fields are dropped, so a client cannot set `owner` or `project`.
- **Errors**: one error middleware formats every error. Mongoose bad-id and duplicate-key errors are also handled.
- **Delete project**: the project and its tasks are deleted together in one transaction.
- **Due dates**: stored as midnight UTC dates.
- **Filter and sort**: the status filter runs in MongoDB. Sorting is a small pure function in `tasks.sort.js`. Tasks without a due date always come last when sorting by due date.
- **CORS**: only the origin in `CLIENT_URL` is allowed.

## Known limitations

- No automated tests. Each endpoint was verified by hand with Postman.
- No refresh tokens, rate limiting, password reset or email verification.
- No pagination. Task sorting happens in memory, which is fine for one project's tasks.
- `requireAuth` checks the token only, not whether the user still exists in the database.

## Project structure

```
src
├── app
│   ├── app.js
│   └── server.js
├── features
│   ├── auth
│   │   ├── auth.config.js
│   │   ├── auth.controller.js
│   │   ├── auth.routes.js
│   │   ├── auth.service.js
│   │   ├── auth.validation.js
│   │   └── user.model.js
│   ├── projects
│   │   ├── project.model.js
│   │   ├── projects.config.js
│   │   ├── projects.controller.js
│   │   ├── projects.routes.js
│   │   ├── projects.service.js
│   │   └── projects.validation.js
│   └── tasks
│       ├── task.model.js
│       ├── tasks.config.js
│       ├── tasks.controller.js
│       ├── tasks.routes.js
│       ├── tasks.service.js
│       ├── tasks.sort.js
│       └── tasks.validation.js
└── shared
    ├── config
    │   ├── db.js
    │   └── env.js
    ├── middlewares
    │   ├── auth.middleware.js
    │   ├── error.middleware.js
    │   └── validate.middleware.js
    └── utils
        └── AppError.js
```

## Deployment (optional)

Example with Render:

| Setting | Value |
|---|---|
| Build command | `npm install` |
| Start command | `npm start` |
| Environment variables | `CLIENT_URL` (the exact frontend URL), `MONGODB_URI`, `JWT_SECRET` (a new random value), `JWT_EXPIRES_IN` |

In Atlas, allow the hosting provider's IP addresses under Network Access. On a free Render plan the server sleeps when idle, so the first request after a pause can take a while.

## How I built it

I built the backend first, in phases, and tested each phase by hand with Postman before moving on.

| Phase | What I did |
|---|---|
| 1. Setup | `npm init -y`, then `npm install express mongoose cors dotenv zod` and `npm install -D nodemon`. Set `"type": "module"` and the `dev` and `start` scripts. Created the feature-based folders, Zod environment validation, the database connection, `AppError` and the error middleware. |
| 2a. Auth | `npm install bcryptjs jsonwebtoken`. Added the `auth` feature (signup, login, me), the `validate` middleware and the `requireAuth` middleware. |
| 3a. Projects | Added the `projects` feature: CRUD limited to the owner. |
| 4a. Tasks | Added the `tasks` feature nested under projects. Deleting a project now deletes its tasks in a transaction. |
| 5a. Filter and sort | Added the query validation and `tasks.sort.js`. |
| 6. CORS and docs | Restricted CORS to `CLIENT_URL`. Wrote this README and `.env.example`. |
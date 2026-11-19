import express from 'express';
import cors from 'cors';
import {env} from '../shared/config/env.js';
import { notFound, errorHandler } from '../shared/middlewares/error.middleware.js';
import authRoutes from '../features/auth/auth.routes.js';
import projectRoutes from '../features/projects/projects.routes.js';
import taskRoutes from '../features/tasks/tasks.routes.js';

const app = express();

// app.use(cors());              //For development only
app.use(cors({ origin: env.CLIENT_URL }));   //For production

app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
})

//our routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);


//error handler routes
app.use(notFound);
app.use(errorHandler);

export default app;
import express from 'express';
import cors from 'cors';
import {env} from '../shared/config/env.js';
import { notFound, errorHandler } from '../shared/middlewares/error.middleware.js';
import authRoutes from '../features/auth/auth.routes.js';

const app = express();

// app.use(cors({origin: env.CLIENT_URL, credentials: true}));

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
    res.json({status: 'ok'});
})

//our routes
app.use('/api/auth', authRoutes);


//error handler routes
app.use(notFound);
app.use(errorHandler);

export default app;
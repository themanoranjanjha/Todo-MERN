 import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './routes/user.routes.js';
import todoRouter from './routes/todo.routes.js';
 const app = express();

 app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
 }))

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(express.static('public'));
app.use(cookieParser());
// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/todos', todoRouter);

// http://localhost:8000/api/v1/users/register

 export { app };
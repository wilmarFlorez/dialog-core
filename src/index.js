import express from 'express';
import connectDB from './config/db.js';
import webhookRoutes from './routes/webhook.routes.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import cors from 'cors';

import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const PORT = process.env.PORT;

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
app.use('/whatsapp', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
  // connect to MongoDB
  connectDB();
});

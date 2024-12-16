import express from 'express';
import connectDB from './config/db.js';
import webhookRoutes from './routes/webhook.routes.js';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';

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
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
  // connect to MongoDB
  connectDB();
});

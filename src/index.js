import express from 'express';
import connectDB from '../config/db.js';
import webhookRoutes from './routes/webhook.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// routes
app.use('/whatsapp', webhookRoutes);
app.use('/api/auth', authRoutes);

// connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});

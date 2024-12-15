import express from 'express';
import connectDB from '../config/db.js';
import webhookRoutes from './routes/webhookRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

// routes
app.use('/whatsapp', webhookRoutes);

// connect to MongoDB
connectDB();

app.listen(PORT, () => {
  console.log(`server listening at port ${PORT}`);
});

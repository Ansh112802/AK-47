import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js'; // ✅ this is the key
import assignmentRoutes from './routes/assignment.js'; // ✅ NEW import

import inventoryRoutes from "./routes/inventoryRoutes.js";
import purchaseRoutes from "./routes/purchaseRoutes.js";
import transferRoutes from "./routes/transferRoutes.js";
import dashboardRoutes from './routes/dashboard.js';
import netMovementRouter from './routes/netMovement.js'; // adjust path accordingly



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://divyanshsingh112802:JwFYHD7b5jnYmfXW@cluster0.sizdxnv.mongodb.net/?retryWrites=true&w=majority';

app.use(cors({
  origin: "http://localhost:3001" // allow your React frontend
}));
app.use(express.json());

// 👇 Mount the routes
app.use('/auth', authRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/purchases", purchaseRoutes);
app.use("/api/transfers", transferRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', netMovementRouter);


app.get('/', (req, res) => {
  res.send('API is running...');
});

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
  

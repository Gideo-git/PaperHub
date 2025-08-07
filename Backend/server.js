// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import paperRoute from './routes/paperRoute.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());

// 2. Parse incoming JSON request bodies. This MUST come before your routes.
app.use(express.json());

// 3. Optional: Your logging middleware
app.use((req, res, next) => {
    console.log(`[SERVER] Request Received: ${req.method} ${req.originalUrl}`);
    next();
});


// Routes
app.use('/api/papers', paperRoute);
app.use('/api/auth', authRoute);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(' MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' MongoDB connection failed:', err.message);
  });

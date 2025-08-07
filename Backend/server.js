// server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import paperRoute from './routes/paperRoute.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';

dotenv.config();
// Force a new deployment on Render
const app = express();

app.use(express.json());
//... rest of the file

const PORT = 5000;

// Add this to server.js
app.use((req, res, next) => {
    console.log(`[SERVER] Request Received: ${req.method} ${req.originalUrl}`);
    next();
});

app.use(cors());

// Middleware
app.use(express.json());



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

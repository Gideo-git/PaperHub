// routes/paperRouter.js

import express from 'express';
import { uploadPaper, accessPaper, downloadPaper, availableSubjects } from '../controllers/paperController.js';
import auth from '../middleware/auth.js';
import upload from '../config/multerConfig.js';

console.log('[ROUTER] paperRouter.js file has been loaded'); 

const router = express.Router();


// POST /api/papers/upload
router.post('/upload', auth, upload.single('file'), uploadPaper);

// GET /api/papers/subjects
router.get('/subjects', auth, availableSubjects);

// GET /api/papers/download/:id  (Dynamic route with a parameter)
router.get('/download/:id', auth, downloadPaper);

// --- The most general route should be last ---

// GET /api/papers/
router.get('/', auth, accessPaper);

export default router;
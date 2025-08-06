import express from 'express';
import { uploadPaper, accessPaper,downloadPaper } from '../controllers/paperController.js';
import auth from '../middleware/auth.js';
import upload from '../config/multerConfig.js';

const router = express.Router();

router.post('/upload', auth, upload.single('file'), uploadPaper);
router.get('/', auth, accessPaper);
router.get('/download/:id', auth, downloadPaper);


export default router;

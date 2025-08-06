import express from 'express';
import { uploadPaper, accessPaper,downloadPaper } from '../controllers/paperController.js';
import auth from '../middleware/auth.js';
import upload from '../utils/multerConfig.js';

const router = express.Router();

router.post('/upload', auth, upload.single('file'), uploadPaper);
router.get('/papers', auth, accessPaper);
router.get('/download/:id', auth, downloadPaper);


export default router;

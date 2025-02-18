// src/routes/uploadRoutes.ts
import { Router } from 'express';
import { uploadCsv } from '../controllers/uploadController';
import { getStatus } from '../controllers/statusController';
import { uploadSingleCsv } from '../middleware/uploadMiddleware';

const router = Router();

// POST /upload to upload CSV and trigger processing
router.post('/upload', uploadSingleCsv, uploadCsv);

// GET /status/:requestId to fetch processing status and product details
router.get('/status/:requestId', getStatus);

export default router;

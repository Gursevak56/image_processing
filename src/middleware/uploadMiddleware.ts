// src/middleware/uploadMiddleware.ts
import multer from 'multer';

// Configure multer to store uploaded CSV files in the 'uploads' directory
const upload = multer({ dest: 'uploads/' });

export const uploadSingleCsv = upload.single('csvFile');

// src/routes/index.ts
import { Router } from 'express';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/', uploadRoutes);

export default router;

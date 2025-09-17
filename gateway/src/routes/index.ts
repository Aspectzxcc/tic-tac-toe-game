
import express from 'express';
import internalRoutes from './internalRoutes.js';

const router = express.Router();

router.use('/internal', internalRoutes);

export default router;
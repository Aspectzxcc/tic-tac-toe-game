import express from 'express';
import * as internalController from '../controllers/internalController.js';
const router = express.Router();

router.post('/broadcast', internalController.broadcastEvent);

export default router;

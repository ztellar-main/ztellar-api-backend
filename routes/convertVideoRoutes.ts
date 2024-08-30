import express from 'express';
const router = express.Router();

import { convertVideoToHls } from '../controllers/convertVideoController';

router.post('/video-convert', convertVideoToHls);

export default router;

import express from 'express';
const router = express.Router();

import {
  createReminder,
  updateReminder,
  deleteReminder,
} from '../controllers/reminderContoller';
import { protect } from '../utils/protect';

router.post('/create-reminder', protect, createReminder);
router.put('/update-reminder', protect, updateReminder);
router.put('/delete-reminder', protect, deleteReminder);

export default router;

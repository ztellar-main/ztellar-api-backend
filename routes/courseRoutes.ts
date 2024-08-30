import express from 'express';
const router = express.Router();

import {
  ifTitleExist,
  ifLiveIdExist,
  createCourse,
  updateCourseIntroVideoAfterConvertingVideo,
} from '../controllers/courseController';

import { protect } from '../utils/protect';

router.post('/if-title-exist', protect, ifTitleExist);
router.post('/if-live-id-exist', protect, ifLiveIdExist);
router.post('/create-course', protect, createCourse);
router.put(
  '/update-course-intro-video-after-convertion',
  protect,
  updateCourseIntroVideoAfterConvertingVideo
);

export default router;

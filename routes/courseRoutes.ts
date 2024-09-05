import express from 'express';
const router = express.Router();

import {
  ifTitleExist,
  ifLiveIdExist,
  createCourse,
  updateCourseIntroVideoAfterConvertingVideo,
  getCourseAdmin,
  getSingleCourseAdmin,
  updateCourseAdmin,
  updateCourseImageAdmin,
  addSubjectOnCourse
} from '../controllers/courseController';

import { protect } from '../utils/protect';

// ADMIN START
router.post('/if-title-exist', protect, ifTitleExist);
router.post('/if-live-id-exist', protect, ifLiveIdExist);
router.post('/create-course', protect, createCourse);
router.put(
  '/update-course-intro-video-after-convertion',
  protect,
  updateCourseIntroVideoAfterConvertingVideo
);
router.get('/get-all-courses-admin', getCourseAdmin);
router.get('/get-single-courses-admin', getSingleCourseAdmin);
router.put('/update-course-admin', updateCourseAdmin);
router.put('/update-course-image-admin', updateCourseImageAdmin);
router.put('/add-subject-on-course', addSubjectOnCourse);
// ADMIN END

export default router;

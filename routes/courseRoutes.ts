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
  addSubjectOnCourse,
  checkIfVideoTitleAlreadyExist,
  addVideoToSubject,
  editSubjectOrder,
  checkIfTitleAlreadyExist,
  updateCourseSubjectTitle,
  checkVideoTitleIfexists,
  editSubjectVideoTitle,
  getSubjectVideos,
  updateSubjectVideosOrder,
  activateOrDeactivateVideo,
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
router.post(
  '/check-if-video-title-already-exists',
  checkIfVideoTitleAlreadyExist
);
router.put('/add-video-to-subject-course-admin', addVideoToSubject);
router.put('/edit-subject-order-admin', editSubjectOrder);
router.post('/check-if-subject-title-already-exist', checkIfTitleAlreadyExist);
router.put('/update-course-subject-title', updateCourseSubjectTitle);
router.post(
  '/check-if-subject-video-title-already-exists',
  checkVideoTitleIfexists
);
router.put('/edit-subject-video-title', editSubjectVideoTitle);
router.get('/get-subject-videos', getSubjectVideos);
router.put('/update-subject-videos-order', updateSubjectVideosOrder);
router.put('/activate-or-deactivate-video', activateOrDeactivateVideo);

// ADMIN END

export default router;

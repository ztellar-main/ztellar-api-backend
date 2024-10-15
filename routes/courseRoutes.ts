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
  getCoursePublic,
  getAcquiredCourse,
  setupSubjectQuestionnaire,
  getSubjectQuestions,
  updateSubjectQuestion,
  getCourseSubjectAnswer,
  createAnswer,
  saveAnswer,
  getFineshedAnswer,
  getSingleFineshedAnswer,
  saveRecentClickedSubject,
  getRecentState,
  ifUserPassedAllTheSubjects,
  acquiredCoursePrivateRoute,
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
router.put('/save-subject-questionnaire', setupSubjectQuestionnaire);
router.get('/get-subject-questions', getSubjectQuestions);
router.put('/update-subject-questions', updateSubjectQuestion);

// ADMIN END

// PUBLIC
router.get('/get-single-course-public', getCoursePublic);

// ACQUIRED COURSE
router.get('/acquired-course', protect, getAcquiredCourse);
router.get('/get-course-subject-answer', protect, getCourseSubjectAnswer);
router.post('/create-subject-answer', protect, createAnswer);
router.post('/save-answer', protect, saveAnswer);
router.get('/get-finished-answer', protect, getFineshedAnswer);
router.get('/get-single-finished-answer', protect, getSingleFineshedAnswer);
router.put('/save-recent-sidebar', protect, saveRecentClickedSubject);
router.get('/get-recent-state', protect, getRecentState);
router.get('/if-user-passed-all-subjects', protect, ifUserPassedAllTheSubjects);

// acquired course private route
router.get(
  '/acquired-course-private-route',
  protect,
  acquiredCoursePrivateRoute
);

export default router;

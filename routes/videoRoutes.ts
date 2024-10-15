import express from 'express';
const router = express.Router();

import {
  getVideo,
  courseSubjectVideo,
  getCourseSubjectVideoSegment,
} from '../controllers/videoController';

router.get('/get-preview-video', getVideo);
router.get(
  '/course/:courseId/:subjectId/:videoId/:filename.m3u8',
  courseSubjectVideo
);
router.get(
  '/course/:courseId/:subjectId/:videoId/:segment.m4s',
  getCourseSubjectVideoSegment
);

export default router;

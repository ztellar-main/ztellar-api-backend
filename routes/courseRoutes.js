import express from 'express'
const router = express.Router()

// CONTROLLERS
import { createCourse,
        GetAllAuthorCourses,
        addSubjectToCourse,
        GetSingleAuthorCourse,
        deleteSubjectFromCourse,
        addVideoToSubject,
        deleteCourse,
        checkCourseTitle,
        checkVideoIfExist,
        getAllActiveCourses,
        getSingleActiveCourse,
        getSingleOwnedCourse,
        videoRecentPlayed,
        videoLastPlayed,
        getAllOwnedCourse
} from '../controllers/courseController.js'

import {AddSampleVideo,GetAllSampleVideos} from '../controllers/SampleController.js'

import { protect } from '../middleware/authMiddleware.js';

// NOT PROTECTEDM ROUTES
router.get('/get-all-active-courses',getAllActiveCourses)
router.get('/get-single-active-course',getSingleActiveCourse)

// COURSE
// DONE
router.post('/create-course',createCourse)
// DONE
router.get('/get-all-author-courses',GetAllAuthorCourses)
// DONNE
router.get('/get-single-author-course',GetSingleAuthorCourse)

// DONE
router.delete('/delete-single-author-course',deleteCourse)
// DONE
router.post('/find-title',checkCourseTitle)


// OWNED COURSE
// DONE
router.get('/get-single-owned-course',getSingleOwnedCourse)
// DONE
router.get('/get-all-owned-course',getAllOwnedCourse)

// RECENT VIDEOS
// DONE
router.put('/save-video-current-time',videoRecentPlayed)
// DONE
router.put('/save-video-last-played-time',videoLastPlayed)

// SUBJECT
// DONE
router.post('/add-subject-to-course',addSubjectToCourse)
// DONE
router.put('/delete-subject',deleteSubjectFromCourse)

// VIDEO
// DONE
router.put('/add-video-to-subject',addVideoToSubject)
// DONE
router.post('/find-video-title',checkVideoIfExist)


// SAMPLE
router.post('/add-sample-video',protect,AddSampleVideo)
router.get('/get-sample-videos',protect,GetAllSampleVideos)

export default router
import express from 'express'
import multer from 'multer'
const router = express.Router()

const randomNumber = Math.floor(Math.random() * 1000);

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, '-' + randomNumber + Date.now() + file.originalname)
    }
});
const uploadnow = multer({storage})

import {
    UploadCourseImage,
    UploadCourseVideo,
    UploadSubjectVideo,
    deleteCourseVideoAndImage
} from '../controllers/cloudinaryController.js'

import { protect } from '../middleware/authMiddleware.js';

// CREATE
// DONE
router.post('/course-image-upload',uploadnow.single('image'),UploadCourseImage)
// DONE
router.post('/course-video-upload',uploadnow.single('vid'),UploadCourseVideo)
// DONE
router.post('/course-subject-video-upload',uploadnow.single('vid'),UploadSubjectVideo)

// DELETE
router.post('/delete-course-video',deleteCourseVideoAndImage)

export default router
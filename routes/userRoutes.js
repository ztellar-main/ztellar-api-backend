import express from 'express';
const router = express.Router();

// CONTROLLERS
import {authUser,
        registerUser,
        logoutUser,
        getUserProfile,
        updateUserProfile,
        googleLogin,
        getOtpExpiry,
        ResendOtp,
        verifyEmailAndsignup,
        checkEmail
} from '../controllers/userController.js'

// PROTECT ROUTE
import { protect } from '../middleware/authMiddleware.js';

router.post('/',registerUser)
router.post('/auth',authUser)
router.post('/logout',logoutUser)
// DONE
router.get('/profile',getUserProfile)
// DONE
router.put('/profile',updateUserProfile)


router.post('/google-login-signup',googleLogin)
router.get('/get-otp-expiry',getOtpExpiry)
router.post('/resend-otp',ResendOtp)
router.post('/verify-email-then-signup',verifyEmailAndsignup)
router.post('/signup-validate',checkEmail)

export default router
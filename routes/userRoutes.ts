import express from 'express';
const router = express.Router();

import {
  sendOTp,
  getEmail,
  verifyEmailandSignup,
  getOtpExpiry,
  login,
  getUserOwnedEvent,
  googleLogin,
  updateUser,
  resetPassword,
  resetPasswordSendOtp,
  userList,
  changeProfilePic,
  authorSumTotal,
  getUserForLoginUpdate,
  getUser,
  updateProfilePicAll,
  companyVerifyEmailandSignup,
  udpateAuthorAccountDetails,
  getUserDetailsForUpdateAccountDetails,
  getUserAccountDetails,
} from '../controllers/userController';

import { protect } from '../utils/protect';
import { authorDashboardProtect } from '../utils/protect';

router.post('/send-otp', sendOTp);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/get-email', getEmail);
router.post('/verify-email-and-signup', verifyEmailandSignup);
router.get('/get-otp-expiry', getOtpExpiry);
router.get('/get-user-owned-event', protect, getUserOwnedEvent);
router.put('/update-user', updateUser);
router.put('/reset-password', resetPassword);
router.post('/password-reset-send-otp', resetPasswordSendOtp);
router.get('/user-list', userList);
router.put('/change-profile-pic', protect, changeProfilePic);
router.get('/author-sum', authorSumTotal);
router.get('/get-user-for-login', getUserForLoginUpdate);
router.post('/user-exist', getUser);
router.put('/update-all-profile-pic', updateProfilePicAll);
router.post('/company-verify-email-and-signup', companyVerifyEmailandSignup);

// AUTHOR DASHBOARD ROUTES
router.put(
  '/update-author-account-details',
  authorDashboardProtect(['author', 'partner', 'superAuthorUser']),
  udpateAuthorAccountDetails
);
router.get(
  '/author-details-update-account-details',
  authorDashboardProtect(['author', 'partner', 'superAuthorUser']),
  getUserDetailsForUpdateAccountDetails
);
router.get(
  '/get-author-account-details',
  authorDashboardProtect(['author', 'partner', 'superAuthorUser']),
  getUserAccountDetails
);

export default router;

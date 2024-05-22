import express from "express";
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
} from "../controllers/userController";

import { protect } from "../utils/protect";

router.post("/send-otp", sendOTp);
router.post("/login", login);
router.post("/google-login", googleLogin);
router.post("/get-email", getEmail);
router.post("/verify-email-and-signup", verifyEmailandSignup);
router.get("/get-otp-expiry", getOtpExpiry);
router.get("/get-user-owned-event", protect, getUserOwnedEvent);
router.put("/update-user", updateUser);
router.put("/reset-password", resetPassword);
router.post("/password-reset-send-otp", resetPasswordSendOtp);
router.get("/user-list", userList);
router.put("/change-profile-pic", protect, changeProfilePic);

export default router;

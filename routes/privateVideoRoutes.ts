import express from "express";
const router = express.Router();

import {
  getVideoCipherCredentialsToUpload,
  getVideoCipherVideo,
} from "../controllers/PrivateVideoController";

router.post("/private-video-get-cred", getVideoCipherCredentialsToUpload);
router.post("/private-video", getVideoCipherVideo);

export default router;

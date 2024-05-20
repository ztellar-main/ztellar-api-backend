import express from "express";
const router = express.Router();

import {
  createProduct,
  getAuthorProducts,
  addSubjectOnEvent,
  getSingleAuthorEvent,
  checkEventSubject,
  addVideoToEventSubject,
  checkVideoTitleExistOnSubject,
  getProductSearchCard,
  findProductId,
  getOwnedProducts,
  getViewEventData,
  eventQrScan,
} from "../controllers/productController";

import { protect } from "../utils/protect";

router.post("/create-product", protect, createProduct);
router.get("/get-all-author-events", protect, getAuthorProducts);
router.put("/add-subject-on-event", protect, addSubjectOnEvent);
router.get("/get-single-author-event", protect, getSingleAuthorEvent);
router.post("/check-event-subject", protect, checkEventSubject);
router.put("/add-video-to-event-subject", protect, addVideoToEventSubject);
router.post(
  "/check-video-title-exist-on-subject",
  protect,
  checkVideoTitleExistOnSubject
);
router.get("/get-search-product", getProductSearchCard);
router.get("/find-product-id", protect, findProductId);
router.get("/get-owned-products", protect, getOwnedProducts);
router.get("/get-view-event-product", getViewEventData);
router.get("/get-event-qr-scan", protect, eventQrScan);

export default router;

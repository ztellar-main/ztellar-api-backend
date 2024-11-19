import express from 'express';
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
  updateLinks,
  updateQuestionToEvent,
  getEventQuestion,
  saveAnswerOfEvent,
  addSponsorLogoToEvent,
  addSponsorPostOnEventView,
  certificateUpdate,
  addDownloadableForms,
  saveBoot,
  getAllEventBooths,
  getSingleEventBooths,
  reserveBooth,
  getAuthorDashboard,
  getEventDetailsAuthorDashboard,
  authorUpdateBoothStatusAndBoothLogs,
  getPayment,
} from '../controllers/productController';

import { protect } from '../utils/protect';

router.post('/create-product', protect, createProduct);
router.get('/get-all-author-events', protect, getAuthorProducts);
router.put('/add-subject-on-event', protect, addSubjectOnEvent);
router.get('/get-single-author-event', protect, getSingleAuthorEvent);
router.post('/check-event-subject', protect, checkEventSubject);
router.put('/add-video-to-event-subject', protect, addVideoToEventSubject);
router.post(
  '/check-video-title-exist-on-subject',
  protect,
  checkVideoTitleExistOnSubject
);
router.get('/get-search-product', getProductSearchCard);
router.get('/find-product-id', protect, findProductId);
router.get('/get-owned-products', protect, getOwnedProducts);
router.get('/get-view-event-product', getViewEventData);
router.get('/get-event-qr-scan', protect, eventQrScan);
router.put('/save-attendance', updateLinks);
router.put('/update-questions-of-events', updateQuestionToEvent);
router.get('/get-event-questions', protect, getEventQuestion);
router.put('/save-answer-on-event', protect, saveAnswerOfEvent);
router.put('/save-event-sponsor-logo', addSponsorLogoToEvent);
router.put('/save-event-sponsor-post', addSponsorPostOnEventView);
// UDPATE CERTIFICATE
router.put('/update-cert', certificateUpdate);
// update downloadable forms
router.put('/update-downloadable-forms', addDownloadableForms);

router.put('/save-sponsors-boot', saveBoot);

router.get('/get-all-event-booths', protect, getAllEventBooths);
router.get('/get-single-event-booths', protect, getSingleEventBooths);
router.put('/reserve-booth', protect, reserveBooth);

// ATHOUR DASHBOARD
router.get('/get-author-dashboard', protect, getAuthorDashboard);
router.get(
  '/get-event-details-author-dashboard',
  protect,
  getEventDetailsAuthorDashboard
);
router.put(
  '/author-update-booth-status-and-logs',
  protect,
  authorUpdateBoothStatusAndBoothLogs
);

// SAMPLE
router.get(
  '/get-payment',

  getPayment
);

export default router;

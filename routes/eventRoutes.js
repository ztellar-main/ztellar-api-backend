import express from 'express'
const router = express.Router();

import {
    getOwnedSingleEvent
} from '../controllers/eventController.js';

// DONE
router.get('/get-single_owned-event',getOwnedSingleEvent)

export default router
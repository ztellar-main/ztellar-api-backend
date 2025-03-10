import express from 'express';
const router = express.Router();

import { createTeamForEventContest } from '../controllers/eventContestController';
import { protect } from '../utils/protect';

router.post('/create-event-team', createTeamForEventContest);

export default router;

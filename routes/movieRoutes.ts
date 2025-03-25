import express from 'express';
const router = express.Router();

import {
  createMovie,
  getMoviePublicData,
} from '../controllers/movieController';

router.post('/create', createMovie);
router.get('/movie-data-public', getMoviePublicData);


export default router;

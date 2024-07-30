import express from "express";
const router = express.Router();

import { authorProducts } from "../controllers/authorController";

router.get("/author-poducts", authorProducts);

export default router;

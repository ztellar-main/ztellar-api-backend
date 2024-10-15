import express from "express";
const router = express.Router();

import {
  authorProducts,
  addSponsorBoot,
  getSponsorsBoot
} from "../controllers/authorController";

router.get("/author-poducts", authorProducts);
router.put("/add-sponsors-boot", addSponsorBoot);
router.get("/get-sponsors-boot", getSponsorsBoot);

export default router;

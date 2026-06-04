import express from "express";
import { reviewController } from "./review.controller";

const router = express.Router();

router.post("/", reviewController.createReview);
router.post("/replay", reviewController.createReplay);

export const reviewRouter = router;

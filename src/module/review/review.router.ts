import express from "express";
import { reviewController } from "./review.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  reviewController.createReview,
);
// router.post("/replay", reviewController.createReplay);

router.post(
  "/replay",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  reviewController.createReplay,
);

export const reviewRouter = router;

import express from "express";
import { reviewController } from "./review.controller";
import authMiddleware from "../../middleware/authMiddlewar";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  reviewController.createReview,
);
router.post("/replay", reviewController.createReplay);

export const reviewRouter = router;

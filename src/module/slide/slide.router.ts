// src/modules/slide/slide.router.ts

import { Router } from "express";
import { slideController } from "./slide.controller";
import authMiddleware from "../../middleware/authMiddleware";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = Router();

router.get("/", slideController.getActiveSlides);

router.get("/", slideController.getAllSlides);
router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  slideController.createSlide,
);
router.put(
  "/reorder",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  slideController.reorderSlides,
);
router.get(
  "/:id",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  slideController.getSlideById,
);
router.put(
  "/:id",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  slideController.updateSlide,
);
router.delete(
  "/:id",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  slideController.deleteSlide,
);
router.patch(
  "/:id/toggle",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  slideController.toggleSlideStatus,
);

export const slideRouter = router;

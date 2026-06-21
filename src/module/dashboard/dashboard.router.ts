import express from "express";
import { dashboardController } from "./dashboard.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/admin-overview",
  authMiddleware(Role.ADMIM),
  dashboardController.getAdminOverview,
);

export const dashboardRouter = router;

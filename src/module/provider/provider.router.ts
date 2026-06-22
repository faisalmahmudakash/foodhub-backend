import express from "express";
import { providerController } from "./provider.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  providerController.getMyStats,
);

export const providerRouter = router;

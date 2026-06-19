import express from "express";
import { providerController } from "./provider.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddlewar";

const router = express.Router();

router.post(
  "/:userId",
  authMiddleware(Role.ADMIM),
  providerController.createProvider,
);

export const providerRouter = router;

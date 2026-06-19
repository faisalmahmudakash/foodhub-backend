import express from "express";
import { addonController } from "./addon.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  addonController.createAddon,
);
router.delete(
  "/:addonId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  addonController.deleteAddon,
);
router.put(
  "/:addonId",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  addonController.updateAddon,
);
router.get("/:productId", addonController.getAddon);

export const addonRouter = router;

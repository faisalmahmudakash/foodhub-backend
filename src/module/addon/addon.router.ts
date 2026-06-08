import express from "express";
import { addonController } from "./addon.controller";

const router = express.Router();

router.post("/", addonController.createAddon);
router.delete("/:addonId", addonController.deleteAddon);
router.put("/:addonId", addonController.updateAddon);
router.get("/:productId", addonController.getAddon);

export const addonRouter = router;

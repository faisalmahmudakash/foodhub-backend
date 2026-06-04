import express from "express";
import { addonController } from "./addon.controller";

const router = express.Router();

router.use("/", addonController.createAddon);

export const addonRouter = router;

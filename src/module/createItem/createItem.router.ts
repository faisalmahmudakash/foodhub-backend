import express from "express";
import { createItemController } from "./createItem.controller";

const router = express.Router();

router.post("/", createItemController.createItem);

export const createItemRouter = router;

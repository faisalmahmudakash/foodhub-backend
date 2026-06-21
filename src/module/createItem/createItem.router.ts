import express from "express";
import { createItemController } from "./createItem.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  createItemController.createItem,
);

export const createItemRouter = router;

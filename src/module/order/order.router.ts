import express from "express";
import { orderController } from "./order.controller";
import authMiddleware from "../../middleware/authMiddlewar";
import { Role } from "../../../prisma/generated/prisma/enums";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  orderController.createOrder,
);

export const orderRouter = router;

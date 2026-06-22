import express from "express";
import { orderController } from "./order.controller";
import { Role } from "../../../prisma/generated/prisma/enums";
import authMiddleware from "../../middleware/authMiddleware";

const router = express.Router();

router.post(
  "/",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  orderController.createOrder,
);

router.get("/", authMiddleware(Role.ADMIM), orderController.getAllOrders);

router.get(
  "/customer/:customerId",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  orderController.getOrdersByCustomer,
);

router.get(
  "/provider/mine",
  authMiddleware(Role.ADMIM, Role.PROVIDER),
  orderController.getMyOrders,
);

router.get(
  "/:orderId",
  authMiddleware(Role.ADMIM, Role.PROVIDER, Role.CUSTOMER),
  orderController.getOrderById,
);

router.patch(
  "/:orderId/status",
  authMiddleware(Role.ADMIM),
  orderController.updateOrderStatus,
);

export const orderRouter = router;

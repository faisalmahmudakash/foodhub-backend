import type { Request, Response } from "express";
import { orderService } from "./order.service";

const createOrder = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      res.status(400).json({
        success: false,
        message: "customerId is required",
      });
      return;
    }

    const result = await orderService.createOrder({ customerId });

    console.log("order created:", result);

    res.status(201).json({
      success: true,
      message: "order Create successfull",
      body: result,
    });
  } catch (error: any) {
    console.error("createOrder error:", error);

    const isClientError = error.message === "Cart is Empty";

    res.status(isClientError ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to create order",
    });
  }
};

const getAllOrders = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getAllOrders();

    res.status(200).json({
      success: true,
      message: "All Orders",
      data: result,
    });
  } catch (error: any) {
    console.error("getAllOrders error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch orders",
    });
  }
};

const getOrdersByCustomer = async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params as { customerId: string };
    const result = await orderService.getOrdersByCustomerId(customerId);

    res.status(200).json({
      success: true,
      message: "Customer Orders",
      data: result,
    });
  } catch (error: any) {
    console.error("getOrdersByCustomer error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch your orders",
    });
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params as { orderId: string };
    const result = await orderService.getOrderById(orderId);

    res.status(200).json({
      success: true,
      message: "Order Details",
      data: result,
    });
  } catch (error: any) {
    console.error("getOrderById error:", error);
    const isClientError = error.message === "Order not found";
    res.status(isClientError ? 404 : 500).json({
      success: false,
      message: error.message || "Failed to fetch order",
    });
  }
};

const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params as { orderId: string };
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: "status is required",
      });
      return;
    }

    const result = await orderService.updateOrderStatus({ orderId, status });

    res.status(200).json({
      success: true,
      message: "Order status updated",
      data: result,
    });
  } catch (error: any) {
    console.error("updateOrderStatus error:", error);

    const isClientError =
      error.message === "Order not found" ||
      error.message === "Invalid order status";

    res.status(isClientError ? 400 : 500).json({
      success: false,
      message: error.message || "Failed to update order status",
    });
  }
};

export const orderController = {
  createOrder,
  getAllOrders,
  getOrdersByCustomer,
  getOrderById,
  updateOrderStatus,
};

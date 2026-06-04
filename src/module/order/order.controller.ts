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

    res.status(201).json({
      success: true,
      message: "order Create successfull",
      body: result,
    });

    console.log(result);
  } catch (error: any) {
    const isClientError = error.message === "Cart is empty";

    res.status(isClientError ? 400 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const orderController = {
  createOrder,
};

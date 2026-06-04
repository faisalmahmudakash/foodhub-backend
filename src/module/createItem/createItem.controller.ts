import type { Request, Response } from "express";
import { createItemService } from "./createItem.service";

const createItem = async (req: Request, res: Response) => {
  try {
    const { customerId, productId, priceId, addonIds, quantity } = req.body;

    // Basic validation
    if (!customerId || !productId || !quantity) {
      res.status(400).json({
        success: false,
        message: "customerId, productId, and quantity are required",
      });
      return;
    }

    const result = await createItemService.createItem({
      customerId,
      productId,
      priceId,
      addonIds,
      quantity: Number(quantity),
    });

    console.log("reqbody", req.body);

    res.status(201).json({
      success: true,
      message: "Create Item Successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: "Somthing is Wrong",
      details: error,
    });
  }
};

export const createItemController = {
  createItem,
};

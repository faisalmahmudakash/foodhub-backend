import type { Request, Response } from "express";
import { productService } from "./product.service";

const createProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.createProduct(req.body);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createProductPrice = async (req: Request, res: Response) => {
  try {
    const result = await productService.createProductPrice(req.body);

    console.log(result);

    res.status(201).json({
      success: true,
      message: "Price added successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const productController = {
  createProduct,
  createProductPrice,
};

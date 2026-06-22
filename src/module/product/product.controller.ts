import type { Request, Response } from "express";
import { productService } from "./product.service";

const createProduct = async (req: Request, res: Response) => {
  try {
    const {
      providerId,
      mileTimeId,
      productName,
      description,
      images,
      featured,
      availabilityStatus,
      tags,
      ingredients,
    } = req.body;

    const result = await productService.createProduct({
      providerId,
      mileTimeId,
      productName,
      description,
      images,
      featured,
      availabilityStatus,
      tags,
      ingredients,
    });

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

const updateProduct = async (req: Request, res: Response) => {
  try {
    const {
      providerId,
      mileTimeId,
      productName,
      description,
      images,
      featured,
      availabilityStatus,
      tags,
      ingredients,
    } = req.body;

    const { productId } = req.params as { productId: string };

    const result = await productService.updateProduct({
      productId,
      providerId,
      mileTimeId,
      productName,
      description,
      images,
      featured,
      availabilityStatus,
      tags,
      ingredients,
    });
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

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId: string };
    const result = await productService.deleteProduct(productId);

    res.status(201).json({
      success: true,
      message: "Product Deleted",
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
    const { productId, priceType, size, price, newPrice } = req.body;

    const result = await productService.createProductPrice({
      productId,
      priceType,
      size,
      price,
      newPrice,
    });

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

const deleteAllProductPrice = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId: string };

    const result = await productService.deleteAllProductPrice(productId);

    console.log(result);

    res.status(201).json({
      success: true,
      message: "Price deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProductPrice = async (req: Request, res: Response) => {
  try {
    const { priceId } = req.body;
    const { productId } = req.params as { productId: string };

    const result = await productService.deleteProductPrice(productId, priceId);

    console.log(result);

    res.status(201).json({
      success: true,
      message: "Price deleted successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createMileTime = async (req: Request, res: Response) => {
  try {
    const { mileTime } = req.body;
    const result = await productService.createMileTime({
      mileTime,
    });

    console.log(result);

    res.status(201).json({
      success: true,
      message: "Mile added successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMileTime = async (req: Request, res: Response) => {
  try {
    const result = await productService.getMileTime();

    console.log(result);

    res.status(200).json({
      success: true,
      message: "All Miles",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllProduct = async (req: Request, res: Response) => {
  try {
    const result = await productService.getAllProduct();

    console.log(result);

    res.status(200).json({
      success: true,
      message: "All Product",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /product/provider/mine — used by the provider dashboard's
// "My Products" page. Scoped to the logged-in provider via req.user.id.
const getMyProducts = async (req: Request, res: Response) => {
  try {
    const providerId = req.user!.id;
    const result = await productService.getProductsByProvider(providerId);

    res.status(200).json({
      success: true,
      message: "Your products",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /product/search?q=<term> — used by the navbar search box (suggestions)
// and the /menu?q=<term> filtered grid. Returns only matching products,
// not the full catalog.
const searchProduct = async (req: Request, res: Response) => {
  try {
    const { q } = req.query as { q?: string };

    const result = await productService.searchProduct(q ?? "");

    res.status(200).json({
      success: true,
      message: "Search results",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateMileTime = async (req: Request, res: Response) => {
  try {
    const { mileTime } = req.body;
    const { mileTimeId } = req.params as { mileTimeId: string };

    if (!mileTimeId || !mileTime) {
      return res.status(400).json({
        success: false,
        message: "mile time id is required",
      });
    }

    const result = await productService.updateMileTime({
      mileTimeId,
      mileTime,
    });

    console.log(result);

    res.status(200).json({
      success: true,
      message: "Mile Time Updated",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePrice = async (req: Request, res: Response) => {
  try {
    const { productId, priceId, size, newPrice, price } = req.body;

    const result = await productService.updatePrice({
      productId,
      priceId,
      size,
      newPrice,
      price,
    });

    console.log(result);

    res.status(200).json({
      success: true,
      message: "Price Updated",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteMileTime = async (req: Request, res: Response) => {
  try {
    const { mileTimeId } = req.params as { mileTimeId: string };

    if (!mileTimeId) {
      return res.status(400).json({
        success: false,
        message: "mile time id is required",
      });
    }

    const result = await productService.deleteMileTime({
      mileTimeId,
    });

    console.log(result);

    res.status(200).json({
      success: true,
      message: "Mile Time Deleted",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId: string };
    const result = await productService.getProductById(productId);

    res.status(200).json({
      success: true,
      message: "Product Details",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const productController = {
  createProduct,
  createProductPrice,
  createMileTime,
  getAllProduct,
  getMyProducts,
  searchProduct,
  getMileTime,
  deleteMileTime,
  updateMileTime,
  deleteAllProductPrice,
  deleteProductPrice,
  updatePrice,
  updateProduct,
  deleteProduct,
  getProductById,
};

import type { Request, Response } from "express";
import { addonService } from "./addon.service";

const createAddon = async (req: Request, res: Response) => {
  try {
    const { productId, addonName, price } = req.body;

    const result = await addonService.createAddon({
      productId,
      addonName,
      price,
    });

    console.log(req.body);
    console.log("result", result);

    res.status(201).json({
      success: true,
      message: "Addon Create Successfull",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAddon = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body;
    const { addonId } = req.params as { addonId: string };

    const result = await addonService.deleteAddon({
      productId,
      addonId,
    });

    console.log(req.body);
    console.log("result", result);

    res.status(201).json({
      success: true,
      message: "Addon Deleted",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAddon = async (req: Request, res: Response) => {
  try {
    const { addonName, price } = req.body;
    const { addonId } = req.params as { addonId: string };

    const result = await addonService.updateAddon({
      addonId,
      addonName,
      price,
    });

    console.log(req.body);
    console.log("result", result);

    res.status(201).json({
      success: true,
      message: "updated Addon",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const getAddon = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params as { productId: string };
    const result = await addonService.getAddon(productId);

    console.log(req.body);
    console.log("result", result);

    res.status(201).json({
      success: true,
      message: "All Addon",
      data: result,
    });
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const addonController = {
  createAddon,
  deleteAddon,
  updateAddon,
  getAddon,
};

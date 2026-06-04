import type { Request, Response } from "express";
import { providerService } from "./provider.service";

const createProvider = async (req: Request, res: Response) => {
  try {
    const result = await providerService.createProvider(req.body);

    res.status(201).json({
      success: true,
      message: "Provider Created Successfully",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const providerController = {
  createProvider,
};

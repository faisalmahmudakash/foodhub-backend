import type { Request, Response } from "express";
import { providerService } from "./provider.service";

const getMyStats = async (req: Request, res: Response) => {
  try {
    const providerId = req.user!.id;
    const result = await providerService.getProviderStats(providerId);

    res.status(200).json({
      success: true,
      message: "Provider stats",
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
  getMyStats,
};

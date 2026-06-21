import type { Request, Response } from "express";
import { dashboardService } from "./Dashboard.Service";


const getAdminOverview = async (req: Request, res: Response) => {
  try {
    const result = await dashboardService.getAdminOverview();

    res.status(200).json({
      success: true,
      message: "Admin overview fetched",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const dashboardController = {
  getAdminOverview,
};
import type { Request, Response } from "express";
import { addonService } from "./addon.service";

const createAddon = async (req: Request, res: Response) => {
  try {
    const result = await addonService.createAddon(req.body);

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
      message: "Somthing is wrong",
      details: error,
    });
  }
};

export const addonController = {
  createAddon,
};

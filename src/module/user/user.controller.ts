import type { Request, Response } from "express";
import { userService } from "./user.service";

const updateUser = async (req: Request, res: Response) => {
  const { userid } = req.params;
  const updateData = req.body;

  try {
    const updatedUser = await userService.updateUser(
      userid as string,
      updateData,
    );
    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: { error: error.message } });
  }
};

const updateProfileImage = async (req: Request, res: Response) => {
  const { userid } = req.params;
  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({
      success: false,
      message: { error: "No image data provided" },
    });
  }

  try {
    const imageDataUrl = `data:image/jpeg;base64,${imageBase64}`;
    const updatedUser = await userService.updateProfileImage(
      userid as string,
      imageDataUrl,
    );

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: { error: error.message },
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userid } = req.params;
  try {
    const deletedUser = await userService.deleteUser(userid as string);
    res.status(200).json({ success: true, data: deletedUser });
  } catch (error: any) {
    res.status(500).json({ success: false, message: { error: error.message } });
  }
};

export const userController = {
  updateUser,
  updateProfileImage,
  deleteUser,
};

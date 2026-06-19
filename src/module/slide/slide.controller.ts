import type { Request, Response } from "express";
import { slideService } from "./slide.service";

const getActiveSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await slideService.getActiveSlides();
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch slides",
      error: (error as Error).message,
    });
  }
};

const getAllSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const slides = await slideService.getAllSlides();
    res.status(200).json({
      success: true,
      data: slides,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch slides",
      error: (error as Error).message,
    });
  }
};

const getSlideById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const slide = await slideService.getSlideById(id as string);

    if (!slide) {
      res.status(404).json({
        success: false,
        message: "Slide not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: slide,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch slide",
      error: (error as Error).message,
    });
  }
};

const createSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { image, title, subtitle, order, isActive } = req.body;

    if (!image || !title || !subtitle) {
      res.status(400).json({
        success: false,
        message: "image, title and subtitle must be provided",
      });
      return;
    }

    const slide = await slideService.createSlide({
      image,
      title,
      subtitle,
      order,
      isActive,
    });

    res.status(201).json({
      success: true,
      message: "Slide created successfully",
      data: slide,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to create slide",
      error: (error as Error).message,
    });
  }
};

const updateSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { image, title, subtitle, order, isActive } = req.body;

    const existing = await slideService.getSlideById(id as string);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Slide Not Found",
      });
      return;
    }

    const slide = await slideService.updateSlide(id as string, {
      image,
      title,
      subtitle,
      order,
      isActive,
    });

    res.status(200).json({
      success: true,
      message: "Slide Updated Successfully",
      data: slide,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to update slide",
      error: (error as Error).message,
    });
  }
};

const deleteSlide = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const existing = await slideService.getSlideById(id as string);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "Slide Not Found",
      });
      return;
    }

    await slideService.deleteSlide(id as string);

    res.status(200).json({
      success: true,
      message: "Slide deleted successfully",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to delete slide",
      error: (error as Error).message,
    });
  }
};

const reorderSlides = async (req: Request, res: Response): Promise<void> => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
      res.status(400).json({
        success: false,
        message: "orderedIds array must be provided and cannot be empty",
      });
      return;
    }

    const slides = await slideService.reorderSlides(orderedIds);

    res.status(200).json({
      success: true,
      message: "Slides reorder successfully",
      data: slides,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to reorder slides",
      error: (error as Error).message,
    });
  }
};

const toggleSlideStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const slide = await slideService.toggleSlideStatus(id as string);

    res.status(200).json({
      success: true,
      message: `Slide ${slide.isActive ? "active" : "inactive"} have been updated`,
      data: slide,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Failed to toggle slide status",
      error: (error as Error).message,
    });
  }
};

export const slideController = {
  getActiveSlides,
  getAllSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  toggleSlideStatus,
};

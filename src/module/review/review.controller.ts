import type { Request, Response } from "express";
import { reviewService } from "./review.service";

const createReview = async (req: Request, res: Response) => {
  const { customerId, productId, rating, comment } = req.body;
  try {
    const result = await reviewService.createReview({
      customerId,
      productId,
      rating,
      comment,
    });

    res.status(200).json({
      success: true,
      message: "review created",
      body: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: true,
      message: error.message,
    });
  }
};

const createReplay = async (req: Request, res: Response) => {
  try {
    const { reviewId, userId, comment } = req.body;
    // const reviewId = req.params.reviewId as string;

    const result = await reviewService.createReplay({
      reviewId,
      userId,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Reply added",
      body: result,
    });
  } catch (error: any) {
    const isClientError = error.message === "Review not found";
    res.status(isClientError ? 404 : 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewController = {
  createReview,
  createReplay,
};

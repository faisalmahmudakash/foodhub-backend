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
    const isEligibilityError = error.message?.startsWith(
      "You can only review products",
    );

    res.status(isEligibilityError ? 403 : 400).json({
      success: false,
      message: error.message,
    });
  }
};

const checkCanReview = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { customerId } = req.query;

    if (!productId || typeof productId !== "string") {
      return res.status(400).json({
        success: false,
        message: "productId param is required",
      });
    }

    if (!customerId || typeof customerId !== "string") {
      return res.status(400).json({
        success: false,
        message: "customerId query param is required",
      });
    }

    const canReview = await reviewService.canCustomerReview(
      customerId,
      productId,
    );

    res.status(200).json({
      success: true,
      message: "Checked review eligibility",
      data: { canReview },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
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

// GET /review/provider/mine — used by the provider dashboard's
// "Reviews" page. Scoped to the logged-in provider via req.user.id.
const getMyProductReviews = async (req: Request, res: Response) => {
  try {
    const providerId = req.user!.id;
    const result = await reviewService.getReviewsByProvider(providerId);

    res.status(200).json({
      success: true,
      message: "Reviews on your products",
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const reviewController = {
  createReview,
  createReplay,
  checkCanReview,
  getMyProductReviews,
};

import { prisma } from "../../lib/prisma";
import type { CreateReplayInput, CreateReviewInput } from "./review.types";

const createReview = async ({
  customerId,
  productId,
  rating,
  comment,
}: CreateReviewInput) => {
  const result = await prisma.review.create({
    data: {
      customerId: customerId,
      productId: productId,
      rating: rating,
      comment: comment,
    },
  });

  return result;
};

const createReplay = async ({
  reviewId,
  userId,
  comment,
}: CreateReplayInput) => {
  const review = await prisma.review.findUnique({
    where: {
      reviewId,
    },
  });

  if (!review) {
    throw new Error("Review not found");
  }

  return await prisma.reviewReplay.create({
    data: {
      reviewId,
      userId,
      comment,
    },
    include: {
      user: {
        select: {
          name: true,
          role: true,
        },
      },
    },
  });
};

export const reviewService = {
  createReview,
  createReplay,
};

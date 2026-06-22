import { prisma } from "../../lib/prisma";
import type { CreateReplayInput, CreateReviewInput } from "./review.types";

const canCustomerReview = async (customerId: string, productId: string) => {
  const deliveredOrderItem = await prisma.orderItem.findFirst({
    where: {
      productId,
      order: {
        customerId,
        status: "DELIVERED",
      },
    },
  });

  return Boolean(deliveredOrderItem);
};

const createReview = async ({
  customerId,
  productId,
  rating,
  comment,
}: CreateReviewInput) => {
  const eligible = await canCustomerReview(customerId, productId);

  if (!eligible) {
    throw new Error(
      "You can only review products from orders that have been delivered",
    );
  }

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

// Reviews left on products that belong to this provider — used by the
// provider dashboard's "Reviews" page.
const getReviewsByProvider = async (providerId: string) => {
  return prisma.review.findMany({
    where: {
      product: { providerId },
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, image: true },
      },
      product: {
        select: { productId: true, productName: true, images: true },
      },
      reviewReplays: {
        orderBy: { createdAt: "asc" },
        include: {
          user: {
            select: { id: true, name: true, role: true },
          },
        },
      },
    },
  });
};

export const reviewService = {
  createReview,
  createReplay,
  canCustomerReview,
  getReviewsByProvider,
};

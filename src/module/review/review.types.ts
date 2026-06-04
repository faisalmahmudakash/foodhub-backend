export interface CreateReviewInput {
  customerId: string;
  productId: string;
  rating: number;
  comment: string;
}

export interface CreateReplayInput {
  reviewId: string;
  userId: string;
  comment: string;
}

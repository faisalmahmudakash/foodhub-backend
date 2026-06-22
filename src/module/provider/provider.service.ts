import { prisma } from "../../lib/prisma";

const getProviderStats = async (providerId: string) => {
  const [totalProducts, totalReviews, ratingAgg, orders] = await Promise.all([
    prisma.product.count({ where: { providerId } }),
    prisma.review.count({ where: { product: { providerId } } }),
    prisma.review.aggregate({
      where: { product: { providerId } },
      _avg: { rating: true },
    }),
    prisma.order.findMany({
      where: {
        orderItems: {
          some: { product: { providerId } },
        },
      },
      select: {
        status: true,
        orderItems: {
          where: { product: { providerId } },
          select: { subtotal: true },
        },
      },
    }),
  ]);

  const totalOrders = orders.length;

  const totalRevenue = orders
    .filter((o) => o.status === "DELIVERED")
    .reduce(
      (sum, order) =>
        sum + order.orderItems.reduce((s, item) => s + (item.subtotal ?? 0), 0),
      0,
    );

  const pendingOrders = orders.filter((o) =>
    ["PENDING", "CONFIRMED", "PREPARING", "READY"].includes(o.status),
  ).length;

  return {
    totalProducts,
    totalOrders,
    pendingOrders,
    totalRevenue,
    totalReviews,
    averageRating: ratingAgg._avg.rating ?? 0,
  };
};

export const providerService = {
  getProviderStats,
};

import { prisma } from "../../lib/prisma";

const REVENUE_TREND_DAYS = 14;
const RECENT_ORDERS_LIMIT = 8;
const TOP_PRODUCTS_LIMIT = 5;

const getAdminOverview = async () => {
  const trendStart = new Date(
    Date.now() - REVENUE_TREND_DAYS * 24 * 60 * 60 * 1000,
  );

  const [
    totalProducts,
    totalProviders,
    totalCustomers,
    totalOrders,
    revenueAgg,
    ordersByStatusRaw,
    reviewAgg,
    recentOrders,
    topProductsRaw,
    trendOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: "PROVIDER" } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { totalAmount: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: { status: true },
    }),
    prisma.review.aggregate({
      _avg: { rating: true },
      _count: { rating: true },
    }),
    prisma.order.findMany({
      take: RECENT_ORDERS_LIMIT,
      orderBy: { createdAt: "desc" },
      include: {
        customer: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      _sum: { quantity: true, subtotal: true },
      orderBy: { _sum: { subtotal: "desc" } },
      take: TOP_PRODUCTS_LIMIT,
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: trendStart },
        status: { not: "CANCELLED" },
      },
      select: { createdAt: true, totalAmount: true },
    }),
  ]);

  // Fill in names/images for the top-selling products
  const topProductIds = topProductsRaw.map((p) => p.productId);
  const topProductDetails = await prisma.product.findMany({
    where: { productId: { in: topProductIds } },
    select: { productId: true, productName: true, images: true },
  });
  const productById = new Map(topProductDetails.map((p) => [p.productId, p]));

  const topProducts = topProductsRaw.map((p) => ({
    productId: p.productId,
    productName: productById.get(p.productId)?.productName ?? "Unknown product",
    images: productById.get(p.productId)?.images ?? null,
    quantitySold: p._sum.quantity ?? 0,
    revenue: p._sum.subtotal ?? 0,
  }));

  const ordersByStatus = ordersByStatusRaw.map((s) => ({
    status: s.status,
    count: s._count.status,
  }));

  // Bucket revenue per day for the trend chart, including empty days
  const revenueByDay = new Map<string, number>();
  for (let i = REVENUE_TREND_DAYS - 1; i >= 0; i--) {
    const key = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);
    revenueByDay.set(key, 0);
  }
  for (const order of trendOrders) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (revenueByDay.has(key)) {
      revenueByDay.set(
        key,
        (revenueByDay.get(key) ?? 0) + (order.totalAmount ?? 0),
      );
    }
  }
  const revenueTrend = Array.from(revenueByDay.entries()).map(
    ([date, revenue]) => ({ date, revenue }),
  );

  return {
    totals: {
      products: totalProducts,
      providers: totalProviders,
      customers: totalCustomers,
      orders: totalOrders,
      revenue: revenueAgg._sum.totalAmount ?? 0,
      averageRating: reviewAgg._avg.rating ?? 0,
      reviewCount: reviewAgg._count.rating ?? 0,
    },
    ordersByStatus,
    topProducts,
    recentOrders: recentOrders.map((o) => ({
      orderId: o.orderId,
      status: o.status,
      totalAmount: o.totalAmount ?? 0,
      createdAt: o.createdAt,
      customer: o.customer,
    })),
    revenueTrend,
  };
};

export const dashboardService = {
  getAdminOverview,
};

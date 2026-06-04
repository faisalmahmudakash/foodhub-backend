import { prisma } from "../../lib/prisma";
import type { CreateOrderInput } from "./order.types";

const createOrder = async ({ customerId }: CreateOrderInput) => {
  // ১. CartItems fetch
  const cartItems = await prisma.cartItem.findMany({
    where: { customerId },
    include: {
      productPrice: true,
      cartItemAddons: {
        include: { addon: true },
      },
    },
  });

  if (cartItems.length === 0) {
    throw new Error("Cart is Empty");
  }

  // ২. Price calculate
  const itemsWithPrice = cartItems.map((item) => {
    const basePrice = item.productPrice?.price ?? item.unitPrice;

    if (!basePrice) {
      throw new Error(`Price not found for product: ${item.productId}`);
    }

    const addonTotal = item.cartItemAddons.reduce(
      (sum, a) => sum + a.addon.price,
      0,
    );

    const unitPrice = basePrice + addonTotal;
    const subtotal = unitPrice * item.quantity;

    return { ...item, unitPrice, subtotal };
  });

  // ৩. Total calculate
  const totalAmount = itemsWithPrice.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  // ৪. Transaction
  const order = await prisma.$transaction(async (tx) => {
    // Order create
    const newOrder = await tx.order.create({
      data: {
        customerId,
        totalAmount,
        status: "PENDING",
      },
    });

    // ✅ OrderItems একটা একটা করে create করো addon সহ
    for (const item of itemsWithPrice) {
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: newOrder.orderId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        },
      });

      // ✅ Addon থাকলে OrderItemAddon create করো
      if (item.cartItemAddons.length > 0) {
        await tx.orderItemAddon.createMany({
          data: item.cartItemAddons.map((ca) => ({
            itemId: orderItem.itemId,
            addonId: ca.addon.addonId,
            addonName: ca.addon.addonName, // snapshot
            price: ca.addon.price, // snapshot
          })),
        });
      }
    }

    // Cart clear
    const cardIds = cartItems.map((item) => item.cartId);
    await tx.cartItemAddon.deleteMany({
      where: { cartId: { in: cardIds } },
    });
    await tx.cartItem.deleteMany({ where: { customerId } });

    return newOrder;
  });

  // ৫. Full order return
  return prisma.order.findUnique({
    where: { orderId: order.orderId },
    include: {
      orderItems: {
        include: { orderItemAddons: true },
      },
    },
  });
};

export const orderService = { createOrder };

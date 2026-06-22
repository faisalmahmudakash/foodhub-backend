import { prisma } from "../../lib/prisma";
import { OrderStatus } from "../../../prisma/generated/prisma/enums";
import type { CreateOrderInput } from "./order.types";

const createOrder = async ({ customerId }: CreateOrderInput) => {
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

  const totalAmount = itemsWithPrice.reduce(
    (sum, item) => sum + item.subtotal,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        customerId,
        totalAmount,
        status: "PENDING",
      },
    });

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

      if (item.cartItemAddons.length > 0) {
        await tx.orderItemAddon.createMany({
          data: item.cartItemAddons.map((ca) => ({
            itemId: orderItem.itemId,
            addonId: ca.addon.addonId,
            addonName: ca.addon.addonName,
            price: ca.addon.price,
          })),
        });
      }
    }

    const cardIds = cartItems.map((item) => item.cartId);
    await tx.cartItemAddon.deleteMany({
      where: { cartId: { in: cardIds } },
    });
    await tx.cartItem.deleteMany({ where: { customerId } });

    return newOrder;
  });

  return prisma.order.findUnique({
    where: { orderId: order.orderId },
    include: {
      orderItems: {
        include: { orderItemAddons: true },
      },
    },
  });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          defaultAddress: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: {
              productId: true,
              productName: true,
              images: true,
              provider: {
                select: { id: true, name: true },
              },
            },
          },
          orderItemAddons: true,
        },
      },
    },
  });
};

const getOrdersByCustomerId = async (customerId: string) => {
  return prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: {
      orderItems: {
        include: {
          product: {
            select: { productId: true, productName: true, images: true },
          },
          orderItemAddons: true,
        },
      },
    },
  });
};

// Orders containing at least one item from this provider's products —
// used by the provider dashboard's "Orders" page. orderItems is filtered
// to only this provider's items, and providerSubtotal is computed since
// order.totalAmount covers the whole cart (which may span providers).
const getOrdersByProviderId = async (providerId: string) => {
  const orders = await prisma.order.findMany({
    where: {
      orderItems: {
        some: {
          product: { providerId },
        },
      },
    },
    orderBy: { createdAt: "desc" },
    include: {
      customer: {
        select: { id: true, name: true, email: true, phone: true },
      },
      orderItems: {
        where: {
          product: { providerId },
        },
        include: {
          product: {
            select: { productId: true, productName: true, images: true },
          },
          orderItemAddons: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    ...order,
    providerSubtotal: order.orderItems.reduce(
      (sum, item) => sum + (item.subtotal ?? 0),
      0,
    ),
  }));
};

const getOrderById = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { orderId },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          defaultAddress: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: { productId: true, productName: true, images: true },
          },
          orderItemAddons: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) => {
  const validStatuses = Object.values(OrderStatus);

  if (!validStatuses.includes(status as OrderStatus)) {
    throw new Error("Invalid order status");
  }

  const existingOrder = await prisma.order.findUnique({
    where: { orderId },
  });

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  return prisma.order.update({
    where: { orderId },
    data: { status: status as OrderStatus },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          defaultAddress: true,
        },
      },
      orderItems: {
        include: {
          product: {
            select: { productId: true, productName: true, images: true },
          },
          orderItemAddons: true,
        },
      },
    },
  });
};

export const orderService = {
  createOrder,
  getAllOrders,
  getOrdersByCustomerId,
  getOrdersByProviderId,
  getOrderById,
  updateOrderStatus,
};

import { prisma } from "../../lib/prisma";
import type { addonCreateInput, addonDelete, addonUpdate } from "./addon.types";

const createAddon = async ({
  productId,
  addonName,
  price,
}: addonCreateInput) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }

  if (!addonName) {
    throw new Error("addon Name not inputed");
  }

  if (!price) {
    throw new Error("Price not added");
  }

  const product = await prisma.product.findUnique({
    where: {
      productId,
    },
  });

  if (!product) {
    throw new Error("Product Not Found");
  }

  return await prisma.addon.create({
    data: {
      productId,
      addonName,
      price,
    },
  });
};

const deleteAddon = async ({ productId, addonId }: addonDelete) => {
  if (!productId) {
    throw new Error("Product not found");
  }

  if (!addonId) {
    throw new Error("Addon not found");
  }

  return prisma.addon.delete({
    where: {
      productId,
      addonId,
    },
  });
};

const updateAddon = async ({ addonId, addonName, price }: addonUpdate) => {
  const existingAddon = await prisma.addon.findUnique({
    where: { addonId },
  });

  if (!existingAddon) {
    throw new Error("Addon not found");
  }

  return prisma.addon.update({
    where: {
      addonId,
    },
    data: {
      addonName,
      price,
    },
  });
};

const getAddon = async (productId: string) => {
  const [data, totoal] = await Promise.all([
    prisma.addon.findMany({
      where: {
        productId,
      },
    }),
    prisma.addon.count({
      where: {
        productId,
      },
    }),
  ]);

  return { data, totoal };
};

export const addonService = {
  createAddon,
  deleteAddon,
  updateAddon,
  getAddon,
};

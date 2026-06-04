import { prisma } from "../../lib/prisma";

const createProduct = async (data: any) => {
  return await prisma.product.create({ data });
};

const createProductPrice = async (data: any) => {
  if (data.priceType === "BASE" && data.size) {
    throw new Error("BASE price can't have size");
  }

  if (data.priceType === "SIZE" && !data.size) {
    throw new Error("SIZE price requires size value");
  }

  return await prisma.productPrice.create({ data });
};

export const productService = {
  createProduct,
  createProductPrice,
};

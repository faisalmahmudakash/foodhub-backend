import { prisma } from "../../lib/prisma";
import type {
  CreateMileTimeInput,
  CreatePriceInput,
  CreateProductInput,
  DeleteMileTimeInput,
  UpdateMileTimeInput,
  UpdatePriceInput,
  UpdateProductInput,
} from "./product.types";

const createProduct = async ({
  providerId,
  mileTimeId,
  productName,
  description,
  images,
  featured,
  availabilityStatus,
  tags,
  ingredients,
}: CreateProductInput) => {
  const mileTime = await prisma.mileTime.findUnique({
    where: {
      mileTimeId,
    },
  });

  if (!mileTime) {
    throw new Error("Mile Time not found");
  }

  return await prisma.product.create({
    data: {
      providerId: providerId,
      mileTimeId: mileTimeId,
      productName: productName,
      description: description,
      images: images,
      featured: featured,
      availabilityStatus: availabilityStatus,
      tags: tags,
      ingredients: ingredients,
    },
  });
};

const createProductPrice = async ({
  productId,
  priceType,
  size,
  price,
  newPrice,
}: CreatePriceInput) => {
  console.log(priceType);

  const existingPrice = await prisma.productPrice.findMany({
    where: {
      productId,
    },
  });

  if (priceType === "BASE" && size) {
    throw new Error("BASE price can't have size");
  }

  if (priceType === "SIZE" && !size) {
    throw new Error("SIZE price requires size value");
  }

  // if befor add base price or size price
  const hasBasePrice = existingPrice.some((item) => item.priceType === "BASE");
  const hasSizePrice = existingPrice.some((item) => item.priceType === "SIZE");

  if (priceType === "BASE" && hasSizePrice) {
    throw new Error(
      "This product already has SIZE prices. Delete or update them first.",
    );
  }

  if (priceType === "SIZE" && hasBasePrice) {
    throw new Error(
      "This product already has a BASE price. Delete or update it first.",
    );
  }

  return await prisma.productPrice.create({
    data: {
      productId: productId,
      priceType: priceType,
      size: size,
      price: price,
      newPrice: newPrice,
    },
  });
};

const deleteAllProductPrice = async (productId: string) => {
  return prisma.productPrice.deleteMany({
    where: {
      productId,
    },
  });
};

const deleteProductPrice = async (productId: string, priceId: string) => {
  const existingProductId = await prisma.product.findUnique({
    where: {
      productId,
    },
  });

  if (!existingProductId) {
    throw new Error("This Product have no price");
  }

  const existingPriceId = await prisma.productPrice.findUnique({
    where: {
      priceId,
    },
  });

  if (!existingPriceId) {
    throw new Error("price not found for this id");
  }

  return prisma.productPrice.delete({
    where: {
      productId,
      priceId,
    },
  });
};

const updatePrice = async ({
  productId,
  priceId,
  size,
  newPrice,
  price,
}: UpdatePriceInput) => {
  const existingPrice = await prisma.productPrice.findUnique({
    where: {
      priceId,
    },
  });

  if (!existingPrice) {
    throw new Error("Pirce not found");
  }

  if (existingPrice.productId !== productId) {
    throw new Error("This price does not belong to this product");
  }

  return prisma.productPrice.update({
    where: {
      priceId,
    },
    data: {
      size,
      newPrice,
      price,
    },
  });
};

// Mile Time
const createMileTime = async ({ mileTime }: CreateMileTimeInput) => {
  return await prisma.mileTime.create({
    data: {
      mileTime: mileTime,
    },
  });
};

const getMileTime = async () => {
  const [data, total] = await Promise.all([
    prisma.mileTime.findMany(),
    prisma.mileTime.count(),
  ]);

  return {
    data,
    total,
  };
};

const getAllProduct = async () => {
  const [data, total] = await Promise.all([
    prisma.product.findMany({
      include: {
        productPrices: {
          select: {
            productId: true,
            priceType: true,
            size: true,
            price: true,
            newPrice: true,
          },
        },
      },
    }),
    prisma.product.count(),
  ]);

  return {
    data,
    total,
  };
};

const updateProduct = async ({
  productId,
  providerId,
  mileTimeId,
  productName,
  description,
  images,
  featured,
  availabilityStatus,
  tags,
  ingredients,
}: UpdateProductInput) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      productId,
    },
  });

  if (!existingProduct) {
    throw new Error("Product not found  for update");
  }

  return prisma.product.update({
    where: {
      productId,
    },
    data: {
      providerId,
      mileTimeId,
      productName,
      description,
      images,
      featured,
      availabilityStatus,
      tags,
      ingredients,
    },
  });
};

const deleteProduct = async (productId: string) => {
  const existingProduct = await prisma.product.findUnique({
    where: {
      productId,
    },
  });

  if (!existingProduct) {
    throw new Error("Product Not found");
  }

  return prisma.product.delete({
    where: {
      productId,
    },
  });
};

const updateMileTime = async ({
  mileTimeId,
  mileTime,
}: UpdateMileTimeInput) => {
  const exist = await prisma.mileTime.findUnique({
    where: {
      mileTimeId,
    },
  });

  if (!exist) {
    throw new Error("Mile time not found");
  }

  return await prisma.mileTime.update({
    where: {
      mileTimeId,
    },
    data: {
      mileTime,
    },
  });
};

// const updateProduct = async ({
//   providerId,
//   mileTimeId,
//   productName,
//   description,
//   images,
//   featured,
//   availabilityStatus,
//   tags,
//   ingredients,
//   productPrice,

// }) => {}

const deleteMileTime = async ({ mileTimeId }: DeleteMileTimeInput) => {
  const exist = await prisma.mileTime.findUnique({
    where: {
      mileTimeId,
    },
  });

  if (!exist) {
    throw new Error("Mile time not found");
  }

  return prisma.mileTime.delete({
    where: { mileTimeId },
  });
};

export const productService = {
  createProduct,
  createProductPrice,
  createMileTime,
  getMileTime,
  getAllProduct,
  deleteMileTime,
  updateMileTime,
  deleteAllProductPrice,
  deleteProductPrice,
  updatePrice,
  updateProduct,
  deleteProduct,
};

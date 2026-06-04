import { prisma } from "../../lib/prisma";

type CreateCartInput = {
  customerId: string;
  productId: string;
  priceId?: string;
  addonIds?: string[];
  quantity: number;

  // unitPrice: number;
  // subtotal: number;
};

const createItem = async (data: CreateCartInput) => {
  const quantity = data.quantity ?? 1;

  // 0. Validate product exists
  const product = await prisma.product.findUnique({
    where: {
      productId: data.productId,
    },
  });

  if (!product) throw new Error("Product not found");

  if (product.availabilityStatus === "NOT_AVAILABLE") {
    throw new Error("Product is not available");
  }

  // 1. Get product price (BASE / SIZE)
  const productPrice = await prisma.productPrice.findFirst({
    where: {
      productId: data.productId,
      ...(data.priceId ? { priceId: data.priceId } : { priceType: "BASE" }),
    },
  });

  console.log("productPrice found:", productPrice); // ← এটা add করুন

  if (!productPrice) {
    throw new Error("Product price not found");
  }

  // newPrice থাকলে সেটা use করবে, না হলে price
  const basePrice = Number(productPrice.newPrice ?? productPrice.price) || 0;

  // 2. Get addon price
  let addonPrice = 0;
  let validAddons: { addonId: string }[] = [];

  if (data.addonIds && data.addonIds.length > 0) {
    const addons = await prisma.addon.findMany({
      where: {
        addonId: {
          in: data.addonIds,
        },
      },
    });

    if (addons.length === 0) {
      throw new Error("Addon not found");
    }

    // সব addon এই product এর কিনা check
    const invalidAddon = addons.find(
      (addon) => addon.productId !== data.productId,
    );

    if (invalidAddon) {
      throw new Error("Addon does not belong to this product");
    }

    if (!addons) {
      throw new Error("Addon not found");
    }

    // // Addon এই product এর কিনা check করুন
    // if (addon.productId !== data.productId) {
    //   throw new Error("Addon does not belong to this product");
    // }

    // addonPrice = Number(addon.price) || 0;

    addonPrice = addons.reduce((total, addon) => total + addon.price, 0);
    validAddons = addons.map((addon) => ({ addonId: addon.addonId })); // ✅ addons — আর addon না
  }

  // 3. Calculate unit price
  const unitPrice = basePrice + addonPrice;

  // 4. Calculate subtotal
  const subtotal = unitPrice * quantity;

  console.log("About to create with:", { unitPrice, subtotal }); // ← create এর আগে

  // 5. Create Cart Item
  const cartitem = await prisma.cartItem.create({
    data: {
      customerId: data.customerId,
      productId: data.productId,

      priceId: data.priceId ?? null,
      // addonId: data.addonId ?? null,

      quantity,
      unitPrice,
      subtotal,

      cartItemAddons: {
        create: validAddons,
      },
    },
    include: {
      product: true,
      productPrice: true,
      // addon: true,

      cartItemAddons: {
        include: { addon: true },
      },
    },
  });

  return cartitem;
};

export const createItemService = {
  createItem,
};

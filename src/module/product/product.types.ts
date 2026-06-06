import type {
  AVAILABILITYSTATUS,
  PRICETYPE,
} from "../../../prisma/generated/prisma/enums";

export interface CreateProductInput {
  providerId: string;
  mileTimeId: string;
  productName: string;
  description: string;
  images: string;
  featured: boolean;
  availabilityStatus: AVAILABILITYSTATUS;
  tags: string[];
  ingredients: string[];
}
export interface UpdateProductInput {
  productId: string;
  providerId: string;
  mileTimeId: string;
  productName: string;
  description: string;
  images: string;
  featured: boolean;
  availabilityStatus: AVAILABILITYSTATUS;
  tags: string[];
  ingredients: string[];
}

export interface CreatePriceInput {
  productId: string;
  priceType: PRICETYPE;
  size: string;
  price: number;
  newPrice: number;
}

export interface CreateMileTimeInput {
  mileTime: string[];
}

export interface DeleteMileTimeInput {
  mileTimeId: string;
}

export interface UpdateMileTimeInput {
  mileTimeId: string;
  mileTime: string[];
}

export interface UpdatePriceInput {
  productId: string;
  priceId: string;
  size: string;
  newPrice: number;
  price: number;
}

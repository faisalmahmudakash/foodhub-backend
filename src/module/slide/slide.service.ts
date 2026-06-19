// import { PrismaClient, Slide } from "@prisma/client";

import type { Slide } from "../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";

// const prisma = new PrismaClient();

export interface CreateSlideDto {
  image: string;
  title: string;
  subtitle: string;
  order?: number;
  isActive?: boolean;
}

export interface UpdateSlideDto {
  image?: string;
  title?: string;
  subtitle?: string;
  order?: number;
  isActive?: boolean;
}

const getActiveSlides = async (): Promise<Slide[]> => {
  return prisma.slide.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });
};

const getAllSlides = async (): Promise<Slide[]> => {
  return prisma.slide.findMany({
    orderBy: { order: "asc" },
  });
};

const getSlideById = async (id: string): Promise<Slide | null> => {
  return prisma.slide.findUnique({
    where: { id },
  });
};

const createSlide = async (data: CreateSlideDto): Promise<Slide> => {
  if (data.order === undefined) {
    const lastSlide = await prisma.slide.findFirst({
      orderBy: { order: "desc" },
    });
    data.order = lastSlide ? lastSlide.order + 1 : 0;
  }

  return prisma.slide.create({
    data: {
      image: data.image,
      title: data.title,
      subtitle: data.subtitle,
      order: data.order,
      isActive: data.isActive ?? true,
    },
  });
};

const updateSlide = async (
  id: string,
  data: UpdateSlideDto,
): Promise<Slide> => {
  return prisma.slide.update({
    where: { id },
    data,
  });
};

const deleteSlide = async (id: string): Promise<Slide> => {
  return prisma.slide.delete({
    where: { id },
  });
};

const reorderSlides = async (orderedIds: string[]): Promise<Slide[]> => {
  const updates = orderedIds.map((id, index) =>
    prisma.slide.update({
      where: { id },
      data: { order: index },
    }),
  );

  return prisma.$transaction(updates);
};

const toggleSlideStatus = async (id: string): Promise<Slide> => {
  const slide = await prisma.slide.findUnique({ where: { id } });
  if (!slide) throw new Error("Slide not found");

  return prisma.slide.update({
    where: { id },
    data: { isActive: !slide.isActive },
  });
};

export const slideService = {
  getActiveSlides,
  getAllSlides,
  getSlideById,
  createSlide,
  updateSlide,
  deleteSlide,
  reorderSlides,
  toggleSlideStatus,
};

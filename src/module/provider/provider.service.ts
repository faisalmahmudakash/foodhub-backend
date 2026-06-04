import { prisma } from "../../lib/prisma";

const createProvider = async (data: any) => {
  return await prisma.provider.create({ data });
};

export const providerService = {
  createProvider,
};

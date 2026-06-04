import { prisma } from "../../lib/prisma";

const createAddon = async (data: any) => {
  return await prisma.addon.create({ data });
};

export const addonService = {
  createAddon,
};

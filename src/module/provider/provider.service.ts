import { Role } from "../../../prisma/generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const createProvider = async (id: string) => {
  const existUser = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!existUser) {
    throw new Error("User Not Found");
  }

  if (existUser.role === Role.PROVIDER) {
    throw new Error("This User Already a provider");
  }

  return prisma.user.update({
    where: {
      id,
    },
    data: {
      role: Role.PROVIDER,
    },
  });
};

export const providerService = {
  createProvider,
};

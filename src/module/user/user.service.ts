import type { User } from "../../../prisma/generated/prisma/browser";
import { prisma } from "../../lib/prisma";

const updateUser = async (
  userId: string,
  updateData: Partial<User>,
): Promise<User> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
  return user;
};

const updateProfileImage = async (
  userId: string,
  imageDataUrl: string,
): Promise<User> => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { image: imageDataUrl },
  });
  return user;
};

export const userService = {
  updateUser,
  updateProfileImage,
};

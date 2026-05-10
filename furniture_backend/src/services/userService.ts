import { connect } from "http2";
import { prisma } from "./prismaClient";

export const addProductToFavorite = async (
  userId: number,
  productId: number,
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      products: {
        connect: {
          id: productId,
        },
      },
    },
  });
};

export const removeProductFromFavorite = async (
  userId: number,
  productId: number,
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      products: {
        disconnect: {
          id: productId,
        },
      },
    },
  });
};

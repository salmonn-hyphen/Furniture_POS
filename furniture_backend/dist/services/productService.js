"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductWithRelations = exports.deleteOneProduct = exports.updateOneProduct = exports.getProductById = exports.createOneProduct = void 0;
const prismaClient_1 = require("./prismaClient");
const createOneProduct = async (data) => {
    const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        inventory: data.inventory,
        category: {
            connectOrCreate: {
                where: { name: data.category },
                create: {
                    name: data.category,
                },
            },
        },
        type: {
            connectOrCreate: {
                where: { name: data.type },
                create: {
                    name: data.type,
                },
            },
        },
        images: {
            create: data.images,
        },
    };
    if (data.tags && data.tags.length > 0) {
        data.tags = {
            connectOrCreate: data.tags.map((tagName) => ({
                where: { name: tagName },
                create: {
                    name: tagName,
                },
            })),
        };
    }
    return prismaClient_1.prisma.product.create({ data: productData });
};
exports.createOneProduct = createOneProduct;
const getProductById = async (id) => {
    return prismaClient_1.prisma.product.findUnique({
        where: { id },
        include: {
            images: true,
        },
    });
};
exports.getProductById = getProductById;
const updateOneProduct = async (productId, data) => {
    const productData = {
        name: data.name,
        description: data.description,
        price: data.price,
        discount: data.discount,
        inventory: data.inventory,
        category: {
            connectOrCreate: {
                where: { name: data.category },
                create: {
                    name: data.category,
                },
            },
        },
        type: {
            connectOrCreate: {
                where: { name: data.type },
                create: {
                    name: data.type,
                },
            },
        },
        images: {
            create: data.images,
        },
    };
    if (data.tags && data.tags.length > 0) {
        data.tags = {
            set: [],
            connectOrCreate: data.tags.map((tagName) => ({
                where: { name: tagName },
                create: {
                    name: tagName,
                },
            })),
        };
    }
    if (data.images && data.images.length > 0) {
        productData.images = {
            deleteMany: {},
            create: data.images,
        };
    }
    return prismaClient_1.prisma.product.update({
        where: { id: productId },
        data: productData,
    });
};
exports.updateOneProduct = updateOneProduct;
const deleteOneProduct = async (id) => {
    return prismaClient_1.prisma.product.delete({
        where: { id },
    });
};
exports.deleteOneProduct = deleteOneProduct;
// const {
//       productId,
//       name,
//       description,
//       price,
//       discount,
//       inventory,
//       category,
//       type,
//       tags,
//     } = req.body;
const getProductWithRelations = async (id, userId) => {
    return prismaClient_1.prisma.product.findUnique({
        where: { id },
        omit: {
            categoryId: true,
            typeId: true,
            createdAt: true,
            updatedAt: true,
        },
        include: {
            images: {
                select: {
                    id: true,
                    path: true,
                },
            },
            users: {
                where: {
                    id: userId,
                },
                select: {
                    id: true,
                },
            },
        },
    });
};
exports.getProductWithRelations = getProductWithRelations;
//# sourceMappingURL=productService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostList = exports.getPostWithRelations = exports.deleteOnePost = exports.updateOnePost = exports.getPostById = exports.createOnePost = void 0;
const prismaClient_1 = require("./prismaClient");
const createOnePost = async (postData) => {
    const data = {
        title: postData.title,
        content: postData.content,
        body: postData.body,
        image: postData.image,
        author: {
            connect: { id: postData.authorId },
        },
        category: {
            connectOrCreate: {
                where: { name: postData.category },
                create: {
                    name: postData.category,
                },
            },
        },
        type: {
            connectOrCreate: {
                where: { name: postData.type },
                create: {
                    name: postData.type,
                },
            },
        },
    };
    if (postData.tags && postData.tags.length > 0) {
        data.tags = {
            connectOrCreate: postData.tags.map((tagName) => ({
                where: { name: tagName },
                create: {
                    name: tagName,
                },
            })),
        };
    }
    return prismaClient_1.prisma.post.create({ data });
};
exports.createOnePost = createOnePost;
const getPostById = async (id) => {
    return prismaClient_1.prisma.post.findUnique({
        where: { id },
    });
};
exports.getPostById = getPostById;
const updateOnePost = async (id, postData) => {
    const data = {
        title: postData.title,
        content: postData.content,
        body: postData.body,
        category: {
            connectOrCreate: {
                where: { name: postData.category },
                create: {
                    name: postData.category,
                },
            },
        },
        type: {
            connectOrCreate: {
                where: { name: postData.type },
                create: {
                    name: postData.type,
                },
            },
        },
    };
    if (postData.image) {
        data.image = postData.image;
    }
    if (postData.tags && postData.tags.length > 0) {
        data.tags = {
            set: [],
            connectOrCreate: postData.tags.map((tagName) => ({
                where: { name: tagName },
                create: {
                    name: tagName,
                },
            })),
        };
    }
    return prismaClient_1.prisma.post.update({
        where: { id: id },
        data,
    });
};
exports.updateOnePost = updateOnePost;
const deleteOnePost = async (id) => {
    return prismaClient_1.prisma.post.delete({
        where: { id },
    });
};
exports.deleteOnePost = deleteOnePost;
const getPostWithRelations = async (id) => {
    return prismaClient_1.prisma.post.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            content: true,
            body: true,
            image: true,
            updatedAt: true,
            author: {
                select: {
                    fullName: true,
                },
            },
            category: {
                select: {
                    name: true,
                },
            },
            type: {
                select: {
                    name: true,
                },
            },
            tags: {
                select: {
                    name: true,
                },
            },
        },
    });
};
exports.getPostWithRelations = getPostWithRelations;
const getPostList = async (option) => {
    return prismaClient_1.prisma.post.findMany(option);
};
exports.getPostList = getPostList;
//# sourceMappingURL=postService.js.map
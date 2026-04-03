"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInfinitePostsByPagination = exports.getPostsByPagination = exports.getPost = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../utils/error");
const errorCode_1 = require("../../config/errorCode");
const authService_1 = require("../../services/authService");
const auth_1 = require("../../utils/auth");
const postService_1 = require("../../services/postService");
const check_1 = require("../../utils/check");
const cache_1 = require("../../utils/cache");
exports.getPost = [
    (0, express_validator_1.param)("id", "Post Id is required!").isInt({ gt: 0 }),
    async (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        //if the validation error occurs
        if (error.length > 0) {
            return next((0, error_1.createError)(error[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const postId = req.params.id;
        const userId = req.userId;
        const user = await (0, authService_1.getUserById)(userId);
        (0, auth_1.checkUserIfNotExist)(user);
        const cacheKey = `posts:${JSON.stringify(postId)}`;
        const post = await (0, cache_1.getOrSetCache)(cacheKey, async () => {
            return await (0, postService_1.getPostWithRelations)(+postId);
        });
        (0, check_1.checkModelIfExist)(post);
        res.status(200).json({ message: "The Post Detail is", post });
    },
];
exports.getPostsByPagination = [
    (0, express_validator_1.query)("page", "Page number must be unsigned number!")
        .isInt({ gt: 0 })
        .optional(),
    (0, express_validator_1.query)("limit", "Limit number must be unsigned number!")
        .isInt({ gt: 4 })
        .optional(),
    async (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        //if the validation error occurs
        if (error.length > 0) {
            return next((0, error_1.createError)(error[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const userId = req.userId;
        const user = await (0, authService_1.getUserById)(userId);
        (0, auth_1.checkUserIfNotExist)(user);
        const skip = (+page - 1) * +limit;
        const option = {
            skip,
            take: +limit + 1,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                updatedAt: true,
                author: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: {
                updatedAt: "desc",
            },
        };
        const cacheKey = `post:${JSON.stringify(req.query)}`;
        const posts = await (0, cache_1.getOrSetCache)(cacheKey, async () => {
            return await (0, postService_1.getPostList)(option);
        });
        const hasNextPage = posts.length > +limit;
        let nextPage = null;
        const previousPage = +page !== 1 ? +page - 1 : null;
        if (hasNextPage) {
            posts.pop();
            nextPage = +page + 1;
        }
        res.status(200).json({
            message: "Get All Posts",
            currentPage: page,
            previousPage,
            hasNextPage,
            nextPage,
            posts,
        });
    },
];
exports.getInfinitePostsByPagination = [
    (0, express_validator_1.query)("cursor", "Cursor must be post Id!").isInt({ gt: 0 }).optional(),
    (0, express_validator_1.query)("limit", "Limit number must be unsigned number!")
        .isInt({ gt: 4 })
        .optional(),
    async (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        //if the validation error occurs
        if (error.length > 0) {
            return next((0, error_1.createError)(error[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const lastCursor = req.query.cursor;
        const limit = req.query.limit || 5;
        const userId = req.userId;
        const user = await (0, authService_1.getUserById)(userId);
        (0, auth_1.checkUserIfNotExist)(user);
        const option = {
            take: +limit + 1,
            skip: lastCursor ? 1 : 0,
            cursor: lastCursor ? { id: +lastCursor } : undefined,
            select: {
                id: true,
                title: true,
                content: true,
                image: true,
                updatedAt: true,
                author: {
                    select: {
                        fullName: true,
                    },
                },
            },
            orderBy: { id: "desc" },
        };
        // const posts = await getPostList(option);
        const cacheKey = `posts:${JSON.stringify(req.query)}`;
        const posts = await (0, cache_1.getOrSetCache)(cacheKey, async () => {
            return await (0, postService_1.getPostList)(option);
        });
        const hasNextPage = posts.length > +limit;
        if (hasNextPage) {
            posts.pop();
        }
        const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;
        res.status(200).json({
            message: "Get All infinite posts",
            hasNextPage,
            nextCursor,
            prevCursor: lastCursor,
            posts,
        });
    },
];
//# sourceMappingURL=postController.js.map
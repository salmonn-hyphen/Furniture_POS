"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.createPost = void 0;
const express_validator_1 = require("express-validator");
const errorCode_1 = require("../../config/errorCode");
const error_1 = require("../../utils/error");
const check_1 = require("../../utils/check");
const postService_1 = require("../../services/postService");
const sanitize_html_1 = __importDefault(require("sanitize-html"));
const node_path_1 = __importDefault(require("node:path"));
const promises_1 = require("node:fs/promises");
const imageQueue_1 = __importDefault(require("../../jobs/queues/imageQueue"));
const cacheQueue_1 = require("../../jobs/queues/cacheQueue");
const removeFiles = async (originalFile, optimizedFile) => {
    try {
        const originalFilePath = node_path_1.default.join(__dirname, "../../..", "/uploads/images", originalFile);
        await (0, promises_1.unlink)(originalFilePath);
        if (optimizedFile) {
            const optimizedFilePath = node_path_1.default.join(__dirname, "../../..", "/uploads/optimize", optimizedFile);
            await (0, promises_1.unlink)(optimizedFilePath);
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.createPost = [
    (0, express_validator_1.body)("title", "Title is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("content", "Content is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("body", "Body is required.")
        .trim()
        .notEmpty()
        .customSanitizer((value) => (0, sanitize_html_1.default)(value))
        .notEmpty(),
    (0, express_validator_1.body)("category", "Category is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("type", "Type is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("tags", "Tag is invalid")
        .optional({ nullable: true })
        .customSanitizer((value) => {
        if (value) {
            return value.split(",").filter((tag) => tag.trim() !== "");
        }
        return value;
    }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            if (req.file) {
                await removeFiles(req.file.filename, null);
            }
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { title, content, body, category, type, tags } = req.body;
        const user = req.user;
        const image = req.file;
        (0, check_1.checkFile)(image);
        // const userId = req.userId;
        // const user = await getUserById(userId);
        // if (!user) {
        //   return next(
        //     createError(
        //       "This phone has not registered",
        //       401,
        //       errorCode.unauthenticated,
        //     ),
        //   );
        // }
        const fileName = image?.filename.split(".")[0];
        const job = await imageQueue_1.default.add("optimizeImage ", {
            filePath: req.file?.path,
            fileName: `${fileName}.webp`,
            width: 835,
            height: 577,
            quality: 100,
        }, {
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
        });
        const data = {
            title,
            content,
            body,
            image: req.file.filename,
            authorId: user.id,
            category,
            type,
            tags,
        };
        const post = await (0, postService_1.createOnePost)(data);
        await cacheQueue_1.cacheQueue.add("invalidate-post-cache", {
            pattern: "posts:*",
        }, {
            jobId: `Invalidate-${Date.now()}`,
            priority: 1,
        });
        res.status(201).json({ message: "Successfully created new post" });
    },
];
exports.updatePost = [
    (0, express_validator_1.body)("postId", "Post Id is required.").isInt({ gt: 0 }),
    (0, express_validator_1.body)("title", "Title is required.").trim().notEmpty().escape(),
    (0, express_validator_1.body)("content", "Content is required.").trim().notEmpty().escape(),
    (0, express_validator_1.body)("body", "Body is required.")
        .trim()
        .notEmpty()
        .customSanitizer((value) => (0, sanitize_html_1.default)(value))
        .notEmpty(),
    (0, express_validator_1.body)("category", "Category is required.").trim().notEmpty().escape(),
    (0, express_validator_1.body)("type", "Type is required.").trim().notEmpty().escape(),
    (0, express_validator_1.body)("tags", "Tag is invalid.")
        .optional({ nullable: true })
        .customSanitizer((value) => {
        if (value) {
            return value.split(",").filter((tag) => tag.trim() !== "");
        }
        return value;
    }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            if (req.file) {
                await removeFiles(req.file.filename, null);
            }
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { postId, title, content, body, category, type, tags } = req.body;
        const user = req.user;
        //check is post exist and return error if doesn't
        const post = await (0, postService_1.getPostById)(+postId);
        if (!post) {
            if (req.file) {
                await removeFiles(req.file.filename, null);
            }
            return next((0, error_1.createError)("The post does not exist", 401, errorCode_1.errorCode.invalid));
        }
        //if the user doesn't match with the user who created the post
        if (user.id !== post.authorId) {
            if (req.file) {
                await removeFiles(req.file.filename, null);
            }
            return next((0, error_1.createError)("This action did not allowed", 403, errorCode_1.errorCode.invalid));
        }
        const data = {
            title,
            content,
            body,
            image: req.file,
            category,
            type,
            tags,
        };
        if (req.file) {
            data.image = req.file.filename;
            const fileName = req.file.filename.split(".")[0];
            const job = await imageQueue_1.default.add("optimizeImage ", {
                filePath: req.file?.path,
                fileName: `${fileName}.webp`,
                width: 835,
                height: 577,
                quality: 100,
            }, {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000,
                },
            });
            const optimizedFile = post.image.split(".")[0] + ".webp";
            await removeFiles(post.image, optimizedFile);
        }
        await (0, postService_1.updateOnePost)(post.id, data);
        await cacheQueue_1.cacheQueue.add("invalidate-post-cache", {
            pattern: "posts:*",
        }, {
            jobId: `Invalidate-${Date.now()}`,
            priority: 1,
        });
        res
            .status(200)
            .json({ message: "Successfully updated the post", postId: postId });
    },
];
exports.deletePost = [
    (0, express_validator_1.body)("postId", "Invalid id").isInt({ gt: 0 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const postId = req.body;
        const user = req.user;
        // const userId = req.userId;
        // const user = getUserById(userId);
        // if (!user) {
        //   return next(
        //     createError(
        //       "This phone has not registered",
        //       401,
        //       errorCode.unauthenticated,
        //     ),
        //   );
        // }
        const post = await (0, postService_1.getPostById)(+postId);
        await (0, check_1.checkModelIfExist)(post);
        if (user.id !== post.authorId) {
            return next((0, error_1.createError)("This action did not allowed", 403, errorCode_1.errorCode.invalid));
        }
        const deletedPost = await (0, postService_1.deleteOnePost)(postId);
        await cacheQueue_1.cacheQueue.add("invalidate-post-cache", {
            pattern: "posts:*",
        }, {
            jobId: `Invalidate-${Date.now()}`,
            priority: 1,
        });
        const optimizedImage = post?.image.split(".")[0] + ".webp";
        await removeFiles(post.image, optimizedImage);
        res
            .status(201)
            .json({ message: "Successfully deleted a post", postId: post.id });
    },
];
//# sourceMappingURL=postController.js.map
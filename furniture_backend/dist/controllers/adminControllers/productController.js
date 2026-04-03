"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../utils/error");
const errorCode_1 = require("../../config/errorCode");
const promises_1 = require("fs/promises");
const path_1 = __importDefault(require("path"));
const check_1 = require("../../utils/check");
const imageQueue_1 = __importDefault(require("../../jobs/queues/imageQueue"));
const productService_1 = require("../../services/productService");
const cacheQueue_1 = require("../../jobs/queues/cacheQueue");
const removeFiles = async (originalFiles, optimizedFiles) => {
    try {
        for (const originalFile of originalFiles) {
            const originalFilePath = path_1.default.join(__dirname, "../../..", "/uploads/images", originalFile);
            await (0, promises_1.unlink)(originalFilePath);
        }
        if (optimizedFiles) {
            for (const optimizedFile of optimizedFiles) {
                const optimizedFilePath = path_1.default.join(__dirname, "../../..", "/uploads/optimize", optimizedFile);
                await (0, promises_1.unlink)(optimizedFilePath);
            }
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.createProduct = [
    (0, express_validator_1.body)("name", "Name is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("description", "Description is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("price", "Price is required")
        .isFloat({ min: 0.1 })
        .isDecimal({ decimal_digits: "1,2" }),
    (0, express_validator_1.body)("discount", "Discount is required")
        .isFloat({ min: 0 })
        .isDecimal({ decimal_digits: "1,2" }),
    (0, express_validator_1.body)("inventory", "Inventory is required").isInt({ min: 1 }),
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
            if (req.files && req.files.length > 0) {
                const originalFile = req.files.map((file) => file.filename);
                await removeFiles(originalFile, null);
            }
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { name, description, price, discount, inventory, category, type, tags, } = req.body;
        (0, check_1.checkFile)(req.files && req.files.length > 0);
        await Promise.all(req.files.map(async (image) => {
            const fileName = image?.filename.split(".")[0];
            await imageQueue_1.default.add("optimizeImage ", {
                filePath: image.path,
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
        }));
        const originalFileNames = req.files.map((file) => ({
            path: file.filename,
        }));
        const data = {
            name,
            description,
            price,
            discount,
            inventory: +inventory,
            category,
            type,
            tags,
            images: originalFileNames,
        };
        const post = await (0, productService_1.createOneProduct)(data);
        await cacheQueue_1.cacheQueue.add("invalidate-post-cache", {
            pattern: "posts:*",
        }, {
            jobId: `Invalidate-${Date.now()}`,
            priority: 1,
        });
        res.status(201).json({ message: "Successfully created a new product" });
    },
];
exports.updateProduct = [
    (0, express_validator_1.body)("productId", "Product Id is required").isInt({ min: 1 }),
    (0, express_validator_1.body)("name", "Name is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("description", "Description is required").trim().notEmpty().escape(),
    (0, express_validator_1.body)("price", "Price is required")
        .isFloat({ min: 0.1 })
        .isDecimal({ decimal_digits: "1,2" }),
    (0, express_validator_1.body)("discount", "Discount is required")
        .isFloat({ min: 0 })
        .isDecimal({ decimal_digits: "1,2" }),
    (0, express_validator_1.body)("inventory", "Inventory is required").isInt({ min: 1 }),
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
            if (req.files && req.files.length > 0) {
                const originalFile = req.files.map((file) => file.filename);
                await removeFiles(originalFile, null);
            }
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { productId, name, description, price, discount, inventory, category, type, tags, } = req.body;
        const product = await (0, productService_1.getProductById)(+productId);
        if (!product) {
            if (req.files && req.files.length > 0) {
                const originalFileNames = req.files.map((file) => file.filename);
                await removeFiles(originalFileNames, null);
            }
            return next((0, error_1.createError)("The product doesn't exist", 409, errorCode_1.errorCode.invalid));
        }
        let originalFileNames = [];
        if (req.files && req.files.length > 0) {
            originalFileNames = req.files.map((file) => ({
                path: file.filename,
            }));
        }
        const data = {
            name,
            description,
            price,
            discount,
            inventory: +inventory,
            category,
            type,
            tags,
            images: originalFileNames,
        };
        if (req.files && req.files.length > 0) {
            await Promise.all(req.files.map(async (image) => {
                const fileName = image?.filename.split(".")[0];
                await imageQueue_1.default.add("optimizeImage ", {
                    filePath: image.path,
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
            }));
        }
        const originalImg = product.images.map((img) => img.path);
        const optimizedImg = product.images.map((img) => img.path.split(".")[0] + ".webp");
        await removeFiles(originalImg, optimizedImg);
        const updatedProduct = await (0, productService_1.updateOneProduct)(product.id, data);
        await cacheQueue_1.cacheQueue.add("invalidate-post-cache", {
            pattern: "posts:*",
        }, {
            jobId: `Invalidate-${Date.now()}`,
            priority: 1,
        });
        res
            .status(201)
            .json({ message: "Successfully updated a new product", updatedProduct });
    },
];
exports.deleteProduct = [
    (0, express_validator_1.body)("productId", "Product Id is required").isInt({ min: 1 }),
    async (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { productId } = req.body.productId;
        const product = await (0, productService_1.getProductById)(+productId);
        (0, check_1.checkModelIfExist)(product);
        const deleteProduct = await (0, productService_1.deleteOneProduct)(product.id);
        const originalImg = product.images.map((img) => img.path);
        const optimizedImg = product.images.map((img) => img.path.split(".")[0] + ".webp");
        await removeFiles(originalImg, optimizedImg);
        await cacheQueue_1.cacheQueue.add("invalidate-post-cache", {
            pattern: "posts:*",
        }, {
            jobId: `Invalidate-${Date.now()}`,
            priority: 1,
        });
        res
            .status(201)
            .json({ message: "Successfully deleted a new product", deleteProduct });
    },
];
//# sourceMappingURL=productController.js.map
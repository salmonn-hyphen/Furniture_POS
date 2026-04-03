"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProducts = void 0;
const express_validator_1 = require("express-validator");
const error_1 = require("../../utils/error");
const errorCode_1 = require("../../config/errorCode");
const authService_1 = require("../../services/authService");
const auth_1 = require("../../utils/auth");
const cache_1 = require("../../utils/cache");
const check_1 = require("../../utils/check");
const productService_1 = require("../../services/productService");
exports.getProducts = [
    (0, express_validator_1.param)("id", "Product Id is required!").isInt({ gt: 0 }),
    async (req, res, next) => {
        const error = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        //if the validation error occurs
        if (error.length > 0) {
            return next((0, error_1.createError)(error[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const productId = req.params.id;
        const userId = req.userId;
        const user = await (0, authService_1.getUserById)(userId);
        (0, auth_1.checkUserIfNotExist)(user);
        const cacheKey = `posts:${JSON.stringify(productId)}`;
        const product = await (0, cache_1.getOrSetCache)(cacheKey, async () => {
            return await (0, productService_1.getProductWithRelations)(+productId, user.id);
        });
        (0, check_1.checkModelIfExist)(product);
        res.status(200).json({ message: "The Post Detail is", product });
    },
];
//# sourceMappingURL=productController.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfileOptimization = exports.uploadProfileMultiple = exports.uploadProfile = exports.testPermission = exports.changeLanguage = void 0;
const express_validator_1 = require("express-validator");
const authorize_1 = require("../../utils/authorize");
const authService_1 = require("../../services/authService");
const auth_1 = require("../../utils/auth");
const errorCode_1 = require("../../config/errorCode");
const error_1 = require("../../utils/error");
const check_1 = require("../../utils/check");
const promises_1 = require("node:fs/promises");
const path_1 = __importDefault(require("path"));
const imageQueue_1 = __importDefault(require("../../jobs/queues/imageQueue"));
exports.changeLanguage = [
    (0, express_validator_1.query)("lng", "Invalid language code")
        .trim()
        .notEmpty()
        .matches(/^[a-z]+$/)
        .isLength({ min: 2, max: 3 }),
    (req, res, next) => {
        const errors = (0, express_validator_1.validationResult)(req).array({ onlyFirstError: true });
        if (errors.length > 0) {
            return next((0, error_1.createError)(errors[0].msg, 400, errorCode_1.errorCode.invalid));
        }
        const { lng } = req.query;
        res.cookie("i18next", lng);
        res.status(200).json({ message: req.t("langChange", { lang: lng }) });
    },
];
const testPermission = async (req, res, next) => {
    const userId = req.userId;
    const user = await (0, authService_1.getUserById)(userId);
    (0, auth_1.checkUserIfNotExist)(user);
    const info = {
        title: "Testing Permission",
    };
    const access = (0, authorize_1.authorize)(true, user.role, "AUTHOR");
    if (access == true) {
        info.content = "You have a permission";
    }
    res.status(200).json({ info });
};
exports.testPermission = testPermission;
const uploadProfile = async (req, res, next) => {
    const userId = req.userId;
    const image = req.file;
    const user = await (0, authService_1.getUserById)(userId);
    (0, auth_1.checkUserIfNotExist)(user);
    (0, check_1.checkFile)(image);
    // console.log("File----->", image);
    const fileName = image.filename;
    if (user?.image) {
        try {
            const filePath = path_1.default.join(__dirname, "../../..", "/uploads/images", user.image);
            await (0, promises_1.unlink)(filePath);
        }
        catch (error) {
            console.log(error);
        }
    }
    const userData = {
        image: fileName,
    };
    await (0, authService_1.updateUser)(user.id, userData);
    res.status(200).json({ message: "Profile picture uploaded successfully" });
};
exports.uploadProfile = uploadProfile;
const uploadProfileMultiple = async (req, res, next) => {
    // const userId = req.userId;
    const image = req.file;
    // const user = getUserById(userId);
    // checkUserIfNotExist(user);
    console.log("File-----", image);
    res.status(200).json({
        message: "Multiple picture uploaded successfully",
    });
};
exports.uploadProfileMultiple = uploadProfileMultiple;
const uploadProfileOptimization = async (req, res, next) => {
    const userId = req.userId;
    const image = req.file;
    const user = await (0, authService_1.getUserById)(userId);
    (0, auth_1.checkUserIfNotExist)(user);
    (0, check_1.checkFile)(image);
    const fileName = image?.filename.split(".")[0];
    const job = await imageQueue_1.default.add("optimizeImage ", {
        filePath: req.file?.path,
        fileName: `${fileName}.webp`,
        width: 200,
        height: 200,
        quality: 50,
    }, {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1000,
        },
    });
    // try {
    //   const optimizedImagePath = path.join(
    //     __dirname,
    //     "../../..",
    //     "/uploads/images",
    //     fileName
    //   );
    //   await sharp(req.file?.buffer)
    //     .resize(200, 200)
    //     .webp({ quality: 50 })
    //     .toFile(optimizedImagePath);
    // } catch (error) {
    //   console.log(error);
    //   res.status(500).json({ message: "Image Optimization Failed" });
    //   return;
    // }
    if (user?.image) {
        try {
            const originalFilePath = path_1.default.join(__dirname, "../../..", "/uploads/images", user.image);
            const optimizedFilePath = path_1.default.join(__dirname, "../../..", "/uploads/optimize", user.image.split(".")[0] + ".webp");
            // console.log("Original ===>", originalFilePath);
            // console.log("Optimized ===>", optimizedFilePath);
            await (0, promises_1.unlink)(originalFilePath);
            await (0, promises_1.unlink)(optimizedFilePath);
        }
        catch (error) {
            console.log(error);
        }
    }
    const userData = {
        image: req.file.filename,
    };
    await (0, authService_1.updateUser)(user?.id, userData);
    res.status(200).json({
        message: "Optimized picture uploaded successfully",
        image: fileName + ".webp",
        jobId: job.id,
    });
};
exports.uploadProfileOptimization = uploadProfileOptimization;
//# sourceMappingURL=profileController.js.map
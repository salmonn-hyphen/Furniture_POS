import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { errorCode } from "../../config/errorCode";
import { unlink } from "fs/promises";
import path from "path";
import { checkFile, checkModelIfExist } from "../../utils/check";
import imageQueue from "../../jobs/queues/imageQueue";
import {
  createOneProduct,
  deleteOneProduct,
  getProductById,
  updateOneProduct,
} from "../../services/productService";
import { cacheQueue } from "../../jobs/queues/cacheQueue";
import { deleteOnePost } from "../../services/postService";
import { log } from "console";

interface CustomReq extends Request {
  userId?: number;
  user?: any;
  files?: any;
}

const removeFiles = async (
  originalFiles: string[],
  optimizedFiles: string[] | null,
) => {
  try {
    for (const originalFile of originalFiles) {
      const originalFilePath = path.join(
        __dirname,
        "../../..",
        "/uploads/images",
        originalFile,
      );
      await unlink(originalFilePath);
    }

    if (optimizedFiles) {
      for (const optimizedFile of optimizedFiles) {
        const optimizedFilePath = path.join(
          __dirname,
          "../../..",
          "/uploads/optimize",
          optimizedFile,
        );
        await unlink(optimizedFilePath);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = [
  body("name", "Name is required").trim().notEmpty().escape(),
  body("description", "Description is required").trim().notEmpty().escape(),
  body("price", "Price is required")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required").isInt({ min: 1 }),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
      return value;
    }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.files && req.files.length > 0) {
        const originalFile = req.files.map((file: any) => file.filename);
        await removeFiles(originalFile, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const {
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;

    checkFile(req.files && req.files.length > 0);

    await Promise.all(
      req.files.map(async (image: any) => {
        const fileName = image?.filename.split(".")[0];
        await imageQueue.add(
          "optimizeImage ",
          {
            filePath: image.path,
            fileName: `${fileName}.webp`,
            width: 835,
            height: 577,
            quality: 100,
          },
          {
            attempts: 3,
            backoff: {
              type: "exponential",
              delay: 1000,
            },
          },
        );
      }),
    );

    const originalFileNames = req.files.map((file: any) => ({
      path: file.filename,
    }));
    console.log(originalFileNames);
    const data: any = {
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
    const post = await createOneProduct(data);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      },
    );
    res.status(201).json({ message: "Successfully created a new product" });
  },
];

export const updateProduct = [
  body("productId", "Product Id is required").isInt({ min: 1 }),
  body("name", "Name is required").trim().notEmpty().escape(),
  body("description", "Description is required").trim().notEmpty().escape(),
  body("price", "Price is required")
    .isFloat({ min: 0.1 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("discount", "Discount is required")
    .isFloat({ min: 0 })
    .isDecimal({ decimal_digits: "1,2" }),
  body("inventory", "Inventory is required").isInt({ min: 1 }),
  body("category", "Category is required").trim().notEmpty().escape(),
  body("type", "Type is required").trim().notEmpty().escape(),
  body("tags", "Tag is invalid")
    .optional({ nullable: true })
    .customSanitizer((value) => {
      if (value) {
        return value.split(",").filter((tag: string) => tag.trim() !== "");
      }
      return value;
    }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      if (req.files && req.files.length > 0) {
        const originalFile = req.files.map((file: any) => file.filename);
        await removeFiles(originalFile, null);
      }
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const {
      productId,
      name,
      description,
      price,
      discount,
      inventory,
      category,
      type,
      tags,
    } = req.body;

    const product = await getProductById(+productId);
    if (!product) {
      if (req.files && req.files.length > 0) {
        const originalFileNames = req.files.map((file: any) => file.filename);
        await removeFiles(originalFileNames, null);
      }
      return next(
        createError("The product doesn't exist", 409, errorCode.invalid),
      );
    }

    let originalFileNames = [];
    if (req.files && req.files.length > 0) {
      originalFileNames = req.files.map((file: any) => ({
        path: file.filename,
      }));
    }

    const data: any = {
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
      await Promise.all(
        req.files.map(async (image: any) => {
          const fileName = image?.filename.split(".")[0];
          await imageQueue.add(
            "optimizeImage ",
            {
              filePath: image.path,
              fileName: `${fileName}.webp`,
              width: 835,
              height: 577,
              quality: 100,
            },
            {
              attempts: 3,
              backoff: {
                type: "exponential",
                delay: 1000,
              },
            },
          );
        }),
      );
    }

    const originalImg = product.images.map((img) => img.path);
    const optimizedImg = product.images.map(
      (img) => img.path.split(".")[0] + ".webp",
    );
    await removeFiles(originalImg, optimizedImg);

    const updatedProduct = await updateOneProduct(product.id, data);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      },
    );
    res
      .status(201)
      .json({ message: "Successfully updated a new product", updatedProduct });
  },
];

export const deleteProduct = [
  body("productId", "Product Id is required").isInt({ min: 1 }),
  async (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }
    const { productId } = req.body.productId;
    const product = await getProductById(+productId);
    checkModelIfExist(product);

    const deleteProduct = await deleteOneProduct(product!.id);

    const originalImg = product!.images.map((img) => img.path);
    const optimizedImg = product!.images.map(
      (img) => img.path.split(".")[0] + ".webp",
    );
    await removeFiles(originalImg, optimizedImg);
    await cacheQueue.add(
      "invalidate-post-cache",
      {
        pattern: "posts:*",
      },
      {
        jobId: `Invalidate-${Date.now()}`,
        priority: 1,
      },
    );
    res
      .status(201)
      .json({ message: "Successfully deleted a new product", deleteProduct });
  },
];

import { Request, Response, NextFunction } from "express";
import { body, query, validationResult } from "express-validator";
import { authorize } from "../../utils/authorize";
import { getUserById } from "../../services/authService";
import { checkUserIfNotExist } from "../../utils/auth";

interface CustomReq extends Request {
  userId?: number;
}

export const changeLanguage = [
  query("lng", "Invalid language code")
    .trim()
    .notEmpty()
    .matches(/^[a-z]+$/)
    .isLength({ min: 2, max: 3 }),
  (req: CustomReq, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      const error: any = new Error(errors[0].msg);
      error.status = 400;
      error.code = "Error_Invalid";
      return next(error);
    }
    const { lng } = req.query;
    res.cookie("i18next", lng);
    res.status(200).json({ message: req.t("langChange", { lang: lng }) });
  },
];

export const testPermission = async (
  req: CustomReq,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserIfNotExist(user);
  const info: any = {
    title: "Testing Permission",
  };
  const access = authorize(true, user!.role, "AUTHOR");

  if (access == true) {
    info.content = "You have a permission";
  }
  res.status(200).json({ info });
};

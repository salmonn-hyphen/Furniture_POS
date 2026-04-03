"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const getAllUsers = (req, res, next) => {
    const id = req.userId;
    const user = req.user;
    res
        .status(200)
        .json({ message: req.t("welcome"), userId: id, currentRole: user.role });
};
exports.getAllUsers = getAllUsers;
//# sourceMappingURL=userController.js.map
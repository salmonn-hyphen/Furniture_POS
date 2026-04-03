"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (permission, userRole, ...roles) => {
    const result = roles.includes(userRole);
    let grant = true;
    if (permission && !result) {
        grant = false;
    }
    if (!permission && result) {
        grant = false;
    }
    return grant;
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map
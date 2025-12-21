"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRoles) => (req, _res, next) => {
    const user = req.user;
    if (!user) {
        throw { statusCode: 401, message: "Unauthenticated" };
    }
    if (!allowedRoles.includes(user.role)) {
        throw { statusCode: 403, message: "Access forbidden" };
    }
    next();
};
exports.authorize = authorize;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.login = exports.register = void 0;
const auth_service_1 = require("./auth.service");
const register = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        await (0, auth_service_1.registerStudent)(email, password);
        res.status(201).json({
            message: "Student registered successfully",
        });
    }
    catch (err) {
        next(err);
    }
};
exports.register = register;
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const token = await (0, auth_service_1.loginUser)(email, password);
        res.status(200).json({ token });
    }
    catch (err) {
        next(err);
    }
};
exports.login = login;
/**
 * ✅ NEW: Get current logged-in user
 */
const me = async (req, res) => {
    res.status(200).json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        mentor_requested: req.user.mentor_requested,
    });
};
exports.me = me;

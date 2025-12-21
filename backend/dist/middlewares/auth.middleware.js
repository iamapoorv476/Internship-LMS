"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabase_1 = require("../config/supabase");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
        const token = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // 🔥 CRITICAL: Fetch FRESH user data from database
        const { data: user, error } = await supabase_1.supabase
            .from("users")
            .select("id, email, role, mentor_requested")
            .eq("id", decoded.userId)
            .single();
        if (error || !user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        // Use the FRESH data from database, not the stale JWT data
        req.user = {
            id: user.id,
            email: user.email,
            role: user.role, // This will be "mentor" if approved!
            mentor_requested: user.mentor_requested || false,
        };
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticate = authenticate;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerStudent = void 0;
const supabase_1 = require("../../config/supabase");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../config/jwt");
const registerStudent = async (email, password) => {
    const passwordHash = await (0, hash_1.hashPassword)(password);
    const { error } = await supabase_1.supabase.from("users").insert({
        email,
        password_hash: passwordHash,
        role: "student",
        is_approved: true
    });
    if (error) {
        throw {
            statusCode: 400,
            message: error.message
        };
    }
    return true;
};
exports.registerStudent = registerStudent;
const loginUser = async (email, password) => {
    const { data: user, error } = await supabase_1.supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    if (error || !user) {
        throw {
            statusCode: 401,
            message: "Invalid credentials"
        };
    }
    if (user.role === "mentor" && !user.is_approved) {
        throw {
            statusCode: 403,
            message: "Mentor not approved"
        };
    }
    const valid = await (0, hash_1.comparePassword)(password, user.password_hash);
    if (!valid) {
        throw {
            statusCode: 401,
            message: "Invalid credentials"
        };
    }
    const token = (0, jwt_1.signToken)({
        userId: user.id,
        role: user.role
    });
    return token;
};
exports.loginUser = loginUser;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.approveMentor = exports.getAllUsers = void 0;
const supabase_1 = require("../../config/supabase");
const getAllUsers = async () => {
    const { data, error } = await supabase_1.supabase
        .from("users")
        .select("id, email, role, is_approved, created_at")
        .order("created_at", { ascending: false });
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
    return data;
};
exports.getAllUsers = getAllUsers;
const approveMentor = async (userId) => {
    const { data: user, error: findError } = await supabase_1.supabase
        .from("users")
        .select("id, role")
        .eq("id", userId)
        .single();
    if (!user) {
        throw { statusCode: 404, message: "User not found" };
    }
    if (user.role !== "mentor") {
        throw { statusCode: 400, message: "User is not a mentor" };
    }
    const { error } = await supabase_1.supabase
        .from("users")
        .update({ is_approved: true })
        .eq("id", userId);
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
};
exports.approveMentor = approveMentor;
const deleteUser = async (userId) => {
    const { error } = await supabase_1.supabase
        .from("users")
        .delete()
        .eq("id", userId);
    if (error) {
        throw { statusCode: 500, message: error.message };
    }
};
exports.deleteUser = deleteUser;

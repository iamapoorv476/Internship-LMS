import { supabase } from "../../config/supabase";

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role, is_approved, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw { statusCode: 500, message: error.message };
  }

  return data;
};

export const approveMentor = async (userId: string) => {
  const { data: user, error: findError } = await supabase
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

  const { error } = await supabase
    .from("users")
    .update({ is_approved: true })
    .eq("id", userId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }
};

export const deleteUser = async (userId: string) => {
  const { error } = await supabase
    .from("users")
    .delete()
    .eq("id", userId);

  if (error) {
    throw { statusCode: 500, message: error.message };
  }
};

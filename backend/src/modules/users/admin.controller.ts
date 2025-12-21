import { Request, Response } from "express";
import { supabase } from "../../config/supabase";

export const listMentorRequests = async (_req: Request, res: Response) => {
  console.log("=== Fetching mentor requests ===");
  
  const { data, error } = await supabase
    .from("users")
    .select("id, email")
    .eq("mentor_requested", true)
    .eq("role", "student");

  console.log("Mentor requests found:", data);
  console.log("Error (if any):", error);

  res.json(data);
};

export const approveMentor = async (
  req: Request,
  res: Response
) => {
  const { id } = req.params;
  
  console.log("=== Approving mentor ===");
  console.log("User ID to approve:", id);

  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id, email, role, mentor_requested")
    .eq("id", id)
    .single();

  console.log("Existing user:", existingUser);
  console.log("Fetch error:", fetchError);

  if (fetchError || !existingUser) {
    console.error("User not found!");
    return res.status(404).json({ message: "User not found" });
  }

  const { data: updatedUser, error: updateError } = await supabase
    .from("users")
    .update({
      role: "mentor",
      mentor_requested: false
    })
    .eq("id", id)
    .select()
    .single();

  console.log("Updated user:", updatedUser);
  console.log("Update error:", updateError);

  if (updateError) {
    console.error("Update failed:", updateError);
    throw { statusCode: 500, message: updateError.message };
  }

  console.log("=== Mentor approved successfully ===");
  res.json({ message: "Mentor approved", user: updatedUser });
};
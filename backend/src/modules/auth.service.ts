import { supabase } from "../config/supabase";
import { hashPassword,comparePassword } from "../utils/hash";
import { signToken } from "../config/jwt";

export const registerStudent = async (email:string,password: string)=>{
    const passwordHash = await hashPassword(password);

    const {error} = await supabase.from("users").insert({
        email,
        password_hash:passwordHash,
        role:"student",
        is_approved:true
    });
    if (error) {
    throw { statusCode: 400, message: error.message };
  }

};

export const loginUser = async (email:string,password:string)=>{
    const {data:user} = await supabase
    .from("users")
    .select("*")
    .eq("email",email)
    .single();
    if (!user) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  if (user.role === "mentor" && !user.is_approved) {
    throw { statusCode: 403, message: "Mentor not approved" };
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    throw { statusCode: 401, message: "Invalid credentials" };
  }

  const token = signToken({
    userId: user.id,
    role: user.role
  });

  return token;
}


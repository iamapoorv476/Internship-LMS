import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  supabaseUrl: process.env.SUPABASE_URL as string,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiry: process.env.JWT_EXPIRES_IN || "1d"
};

if (!env.supabaseUrl || !env.supabaseServiceKey || !env.jwtSecret) {
  throw new Error("❌ Missing required environment variables");
}

import dotenv from "dotenv";

dotenv.config();

export const envVariables = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV:process.env.NODE_ENV,
  JWT_ACCESS_SECRET: process.env.MONGO_URI,
  JWT_ACCESS_EXPIRE: process.env.MONGO_URI,
  JWT_REFRESH_SECRET: process.env.MONGO_URI,
  JWT_REFRESH_EXPIRE: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
  EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
};

import dotenv from "dotenv";

dotenv.config();

export const envVariables = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.MONGO_URI,
  JWT_EXPIRE: process.env.MONGO_URI,
  CLIENT_URL: process.env.CLIENT_URL,
  BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,
};

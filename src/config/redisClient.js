import { createClient } from "redis";
import { envVariables } from "./envVariables.js";

export const redisClient = createClient({
  username: envVariables.REDIS_USERNAME,
  password: envVariables.REDIS_PASSWORD,
  socket: {
    host: envVariables.REDIS_HOST,
    port: Number(envVariables.REDIS_PORT || 6379),
  },
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error ❌", err.message);
});

redisClient.on("end", async () => {
  console.warn("Redis connection closed ❌ — trying to reconnect...");
  try {
    await redisClient.connect();
    console.log("Redis reconnected ✅");
  } catch (err) {
    console.error("Redis reconnection failed:", err.message);
  }
});

redisClient.on("ready", () => {
  console.log("Redis is ready to use 🚀");
});

export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
    console.log("Redis Connected ✅");
  }
};

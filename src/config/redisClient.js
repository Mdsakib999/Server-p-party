import { createClient } from 'redis';
import { envVariables } from './envVariables.js';

export const redisClient = createClient({
    username: envVariables.REDIS_USERNAME,
    password: envVariables.REDIS_PASSWORD,
    socket: {
        host: envVariables.REDIS_HOST,
        port: Number(envVariables.REDIS_PORT || 6379),
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

export const connectRedis = async () => {
    if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log("Redis Connected ✅");
    }
}
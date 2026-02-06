import { rateLimit } from "express-rate-limit";

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  message: "Too many attempts. Try again later.",
});

export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 3,
  message: "Too many OTP requests.",
});

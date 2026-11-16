import { rateLimit } from "express-rate-limit";
import AppError from "../lib/errors.js";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  skipSuccessfulRequests: true,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new AppError(
        429,
        "TOO_MANY_ATTEMPTS",
        "Muitas tentativas. Tente novamente em 15 minutos",
      ),
    );
  },
});

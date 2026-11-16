import type { RequestHandler } from "express";
import AppError from "../lib/errors.js";
import { verifyToken } from "../lib/jwt.js";
import { SESSION_COOKIE } from "../lib/cookie.js";

export const requireAuth: RequestHandler = async (req, res, next) => {
  const token = req.cookies?.[SESSION_COOKIE];
  if (!token) {
    throw new AppError(401, "UNAUTHORIZED", "Autenticação necessária");
  }

  try {
    const { sub } = await verifyToken(token);
    req.adminId = sub;
  } catch {
    throw new AppError(401, "INVALID_TOKEN", "Sessão inválida ou expirada");
  }

  next();
};

import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, RequestHandler, Response } from "express";
import multer from "multer";
import { ZodError } from "zod";
import AppError from "../lib/errors.js";

function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: unknown,
) {
  res.status(status).json({ error: { code, message, details } });
}

export const notFound: RequestHandler = (req) => {
  throw new AppError(
    404,
    "ROUTE_NOT_FOUND",
    `Rota ${req.method} ${req.path} não encontrada`,
  );
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return sendError(res, err.statusCode, err.code, err.message);
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return sendError(res, 400, "VALIDATION_ERROR", "Dados inválidos", details);
  }

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return sendError(
        res,
        413,
        "FILE_TOO_LARGE",
        "Cada foto pode ter no máximo 10 MB",
      );
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return sendError(res, 400, "TOO_MANY_FILES", "Envie no máximo 5 fotos");
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return sendError(
        res,
        400,
        "UNEXPECTED_FILE",
        `Arquivo enviado em um campo inesperado: "${err.field}"`,
      );
    }
    return sendError(res, 400, "INVALID_UPLOAD", "Envio de arquivos inválido");
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return sendError(res, 409, "ALREADY_EXISTS", "Registro já existe");
    }
    if (err.code === "P2025") {
      return sendError(res, 404, "NOT_FOUND", "Registro não encontrado");
    }
  }

  if (err?.type === "entity.parse.failed") {
    return sendError(res, 400, "INVALID_JSON", "JSON inválido");
  }
  if (err?.type === "entity.too.large") {
    return sendError(
      res,
      413,
      "PAYLOAD_TOO_LARGE",
      "Corpo da requisição muito grande",
    );
  }

  console.error(err);
  return sendError(res, 500, "INTERNAL_ERROR", "Erro interno do servidor");
};

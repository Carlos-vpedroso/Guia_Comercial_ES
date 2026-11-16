import type { CookieOptions } from "express";

export const SESSION_COOKIE = "session";

export const sessionCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  ...(process.env.NODE_ENV === "production" && {
    domain: ".guiacomerciales.com",
  }),
  path: "/",
  maxAge: 24 * 60 * 60 * 1000,
};

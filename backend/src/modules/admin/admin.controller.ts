import type { Request, Response } from "express";
import { SESSION_COOKIE, sessionCookieOptions } from "../../lib/cookie.js";
import { loginSchema, registerSchema } from "../../schemas/auth.schema.js";
import adminService from "./admin.service.js";

const adminController = {
  async register(req: Request, res: Response) {
    const data = registerSchema.parse(req.body);
    const admin = await adminService.register(data);

    res.status(201).json(admin);
  },

  async login(req: Request, res: Response) {
    const data = loginSchema.parse(req.body);
    const { token, admin } = await adminService.login(data);

    res.cookie(SESSION_COOKIE, token, sessionCookieOptions);
    res.set("Cache-Control", "no-store");
    res.json(admin);
  },

  logout(req: Request, res: Response) {
    res.clearCookie(SESSION_COOKIE, sessionCookieOptions);
    res.status(204).send();
  },

  async getAdmin(req: Request, res: Response) {
    const admin = await adminService.getAdmin(req.adminId!);
    res.json(admin);
  },
};

export default adminController;

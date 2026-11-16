import { Router } from "express";
import { requireAuth } from "../../middlewares/admin.js";
import { loginLimiter } from "../../middlewares/rateLimit.js";
import adminController from "./admin.controller.js";

const adminRoutes = Router();

adminRoutes.get("/", requireAuth, adminController.getAdmin);
// adminRoutes.post("/register", adminController.register);
adminRoutes.post("/login", loginLimiter, adminController.login);
adminRoutes.post("/logout", adminController.logout);

export default adminRoutes;

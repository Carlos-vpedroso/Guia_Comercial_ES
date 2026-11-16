import { Router } from "express";
import { requireAuth } from "../../middlewares/admin.js";
import { upload } from "../../middlewares/upload.js";
import companyController from "./company.controller.js";

const companyRoutes = Router();

companyRoutes.get("/", companyController.getAll);
companyRoutes.post("/", requireAuth, upload, companyController.create);
companyRoutes.put("/:slug", requireAuth, upload, companyController.update);
companyRoutes.delete("/:slug", requireAuth, companyController.delete);

export default companyRoutes;

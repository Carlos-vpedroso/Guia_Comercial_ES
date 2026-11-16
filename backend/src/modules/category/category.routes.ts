import { Router } from "express";
import categoryController from "./category.controller.js";

// montado em /api/categories (src/lib/routes.ts)
const categoryRoutes = Router();

categoryRoutes.get("/", categoryController.getAll);
categoryRoutes.get("/:slug", categoryController.getCompaniesByCategory);

export default categoryRoutes;

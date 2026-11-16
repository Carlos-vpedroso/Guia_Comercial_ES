import { Router } from "express";
import adminRoutes from "../modules/admin/admin.route.js";
import categoryRoutes from "../modules/category/category.routes.js";
import companyRoutes from "../modules/company/company.routes.js";

const routes = Router();

routes.use("/admin", adminRoutes);
routes.use("/categories", categoryRoutes);
routes.use("/companies", companyRoutes);

export default routes;

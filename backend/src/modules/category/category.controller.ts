import type { Request, Response } from "express";
import categoryService from "./category.service.js";

const categoryController = {
  async getAll(req: Request, res: Response) {
    const categories = await categoryService.getAll();

    // categorias são fixas; só a contagem de empresas pode ficar até 60 min desatualizada
    res.set("Cache-Control", "public, max-age=3600");
    res.json(categories);
  },

  async getCompaniesByCategory(req: Request<{ slug: string }>, res: Response) {
    const category = await categoryService.getCompaniesByCategory(
      req.params.slug,
    );
    res.json(category);
  },
};

export default categoryController;

import AppError from "../../lib/errors.js";
import categoryRepository from "./category.repository.js";

const categoryService = {
  getAll() {
    return categoryRepository.getAllWithCount();
  },

  async getCompaniesByCategory(slug: string) {
    const category = await categoryRepository.getBySlugWithCompanies(slug);
    if (!category) {
      throw new AppError(404, "CATEGORY_NOT_FOUND", "Categoria não encontrada");
    }
    return category;
  },
};

export default categoryService;

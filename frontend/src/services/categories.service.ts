import { Category } from "@/types/Category";
import { PromiseError } from "@/types/Error";

export class CategoryService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  async getAll(): Promise<Category[] | PromiseError> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        return {
          error: {
            code: response.status,
            message: "Erro ao buscar empresas",
          },
        };
      }

      const categories: Category[] = await response.json();

      return categories;
    } catch (error) {
      console.error("Erro ao buscar empresas:", error);
      return {
        error: {
          code: 500,
          message: "Erro inesperado ao buscar empresas",
        },
      };
    }
  }
}
export const categoryService = new CategoryService();

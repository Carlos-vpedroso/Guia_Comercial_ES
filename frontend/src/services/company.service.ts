import { Company, CreateCompanyDTO } from "@/types/Company";
import { PromiseError } from "@/types/Error";

export class CompanyService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;

  async getAll(): Promise<Company[] | PromiseError> {
    try {
      const response = await fetch(`${this.baseUrl}/companies`, {
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

      const companies: Company[] = await response.json();
      return companies;
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

  async createCompany(
    payload: CreateCompanyDTO,
  ): Promise<Company | PromiseError> {
    try {
      const formData = new FormData();

      // Envia os dados da empresa como JSON.
      formData.append("data", JSON.stringify(payload.data));

      // Envia cada imagem como um arquivo separado.
      payload.images.forEach((image) => {
        formData.append("images", image);
      });

      const response = await fetch(`${this.baseUrl}/companies`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        let message = "Erro ao cadastrar empresa.";

        const result = await response.json();
        message = result.error?.message ?? result.message ?? message;

        return {
          error: {
            code: response.status,
            message,
          },
        };
      }

      const company: Company = await response.json();
      return company;
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);

      return {
        error: {
          code: 500,
          message: "Erro inesperado ao cadastrar empresa.",
        },
      };
    }
  }

  async updateCompany(
    slug: string,
    payload: CreateCompanyDTO,
  ): Promise<Company | PromiseError> {
    try {
      const formData = new FormData();

      // Envia os dados da empresa como JSON.
      formData.append("data", JSON.stringify(payload.data));

      // Envia cada imagem como um arquivo separado.
      payload.images.forEach((image) => {
        formData.append("images", image);
      });

      if (payload.deleteImageIds && payload.deleteImageIds.length > 0) {
        formData.append(
          "deleteImageIds",
          JSON.stringify(payload.deleteImageIds),
        );
      }

      const response = await fetch(
        `${this.baseUrl}/companies/${encodeURIComponent(slug)}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        },
      );

      if (!response.ok) {
        let message = "Erro ao cadastrar empresa.";

        const result = await response.json();
        message = result.error?.message ?? result.message ?? message;

        return {
          error: {
            code: response.status,
            message,
          },
        };
      }

      const company: Company = await response.json();
      return company;
    } catch (error) {
      console.error("Erro ao cadastrar empresa:", error);

      return {
        error: {
          code: 500,
          message: "Erro inesperado ao cadastrar empresa.",
        },
      };
    }
  }

  async deleteCompany(slug: string): Promise<void | PromiseError> {
    try {
      const response = await fetch(
        `${this.baseUrl}/companies/${encodeURIComponent(slug)}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (!response.ok) {
        let message = "Erro ao excluir empresa.";

        const result = await response.json();
        message = result.error?.message ?? result.message ?? message;

        return {
          error: {
            code: response.status,
            message,
          },
        };
      }

      // HTTP 204 não possui corpo para converter com response.json().
      return;
    } catch (error) {
      console.error("Erro ao excluir empresa:", error);

      return {
        error: {
          code: 500,
          message: "Erro inesperado ao excluir empresa.",
        },
      };
    }
  }
}

export const companyService = new CompanyService();

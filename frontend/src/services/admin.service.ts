import { Admin } from "@/types/Admin";
import { PromiseError } from "@/types/Error";

export class AdminService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL;
  async login(email: string, password: string): Promise<Admin | PromiseError> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        return {
          error: {
            code: response.status,
            message: "Email ou senha incorreto!",
          },
        };
      }

      const admin: Admin = await response.json();

      return admin;
    } catch (error) {
      console.error("Erro inesperado ao fazer Login:", error);
      return {
        error: {
          code: 500,
          message: "Erro inesperado ao fazer Login",
        },
      };
    }
  }
  async logout(): Promise<{ success: true } | PromiseError> {
    try {
      const response = await fetch(`${this.baseUrl}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        return {
          error: {
            code: response.status,
            message: "Não foi possível encerrar a sessão.",
          },
        };
      }

      return { success: true };
    } catch (error) {
      console.error("Erro inesperado ao fazer logout:", error);

      return {
        error: {
          code: 500,
          message: "Erro inesperado ao fazer logout.",
        },
      };
    }
  }

}

export const adminService = new AdminService();

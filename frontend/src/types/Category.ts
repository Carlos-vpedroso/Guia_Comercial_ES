export interface Category {
  id: number;
  name: string;
  slug: string;

  //Contador de Empresas Cadastradas na Categoria
  companiesCount?: number;

  createdAt?: string;
  updatedAt?: string;
}

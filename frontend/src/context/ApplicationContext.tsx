"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { handleResult } from "@/lib/utils";
import { categoryService } from "@/services/categories.service";
import { companyService } from "@/services/company.service";
import type { Category } from "@/types/Category";
import type { Company } from "@/types/Company";

export type Ordenacao = "relevancia" | "nome";

interface ApplicationContextType {
  selectedCompany: Company | null;
  setSelectedCompany: React.Dispatch<React.SetStateAction<Company | null>>;

  companies: Company[];
  setCompanies: React.Dispatch<React.SetStateAction<Company[]>>;
  filteredCompanies: Company[];
  categories: Category[];
  loading: boolean;

  searchTerm: string;
  searchCompanies: (term: string) => void;

  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;

  selectedCity: string;
  setSelectedCity: React.Dispatch<React.SetStateAction<string>>;

  sortOrder: Ordenacao;
  setSortOrder: React.Dispatch<React.SetStateAction<Ordenacao>>;

  clearFilters: () => void;
}

export const ApplicationContext = createContext<
  ApplicationContextType | undefined
>(undefined);

interface ApplicationProviderProps {
  children: ReactNode;
}

function normalize(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function ApplicationProvider({ children }: ApplicationProviderProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const [companies, setCompanies] = useState<Company[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtros globais da aplicação.
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [selectedCity, setSelectedCity] = useState("Todas");
  const [sortOrder, setSortOrder] = useState<Ordenacao>("relevancia");

  const fetchAll = useCallback(async () => {
    setLoading(true);

    try {
      const [companiesRes, categoriesRes] = await Promise.all([
        companyService.getAll(),
        categoryService.getAll(),
      ]);

      handleResult(companiesRes, setCompanies, "empresas");
      handleResult(categoriesRes, setCategories, "categorias");
    } catch (error) {
      console.error("Erro ao carregar os dados:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
  }, [fetchAll]);

  const searchCompanies = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("Todas");
    setSelectedCity("Todas");
    setSortOrder("relevancia");
  }, []);

  // Única implementação dos filtros e da ordenação.
  const filteredCompanies = useMemo(() => {
    const term = normalize(searchTerm);
    const categoryFilter = normalize(selectedCategory);
    const cityFilter = normalize(selectedCity);

    const result = companies.filter((company) => {
      const searchableText = normalize(
        [
          company.name,
          company.description,
          company.category?.name,
          company.category?.slug,
          company.address?.city,
          company.address?.neighborhood,
          company.address?.state,
        ].join(" "),
      );

      const matchesSearch = !term || searchableText.includes(term);

      const matchesCategory =
        selectedCategory === "Todas" ||
        normalize(company.category?.name) === categoryFilter ||
        normalize(company.category?.slug) === categoryFilter;

      const matchesCity =
        selectedCity === "Todas" ||
        normalize(company.address?.city) === cityFilter;

      return matchesSearch && matchesCategory && matchesCity;
    });

    if (sortOrder === "nome") {
      result.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
    }

    return result;
  }, [companies, searchTerm, selectedCategory, selectedCity, sortOrder]);

  return (
    <ApplicationContext.Provider
      value={{
        selectedCompany,
        setSelectedCompany,
        companies,
        setCompanies,
        filteredCompanies,
        categories,
        loading,
        searchTerm,
        searchCompanies,
        selectedCategory,
        setSelectedCategory,
        selectedCity,
        setSelectedCity,
        sortOrder,
        setSortOrder,
        clearFilters,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
}

"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";
import CriarEmpresaDashboard from "./CriarEmpresaDashboard";

interface Props {
  empresaId?: string;
}

export default function CadastroEmpresaPage({ empresaId }: Props) {
  const router = useRouter();
  const { companies, loading } = useAuth(ApplicationContext);

  const empresa = useMemo(() => {
    if (!empresaId) return null;

    return (
      companies.find((company) => String(company.id) === empresaId) ?? null
    );
  }, [companies, empresaId]);

  if (empresaId && loading) {
    return (
      <div className="text-fundo2 flex-1 p-6">
        Carregando dados da empresa...
      </div>
    );
  }

  if (empresaId && !empresa) {
    return (
      <div className="flex-1 p-6">
        <h2 className="font-title text-fundo2 text-xl font-bold">
          Empresa não encontrada
        </h2>

        <p className="text-fundo2/65 mt-2">
          Não foi possível encontrar uma empresa com o ID informado.
        </p>

        <button
          type="button"
          onClick={() => router.push("/admin/dashboard?Page=empresas")}
          className="bg-marca text-text1 mt-4 rounded-xl px-4 py-2"
        >
          Voltar para empresas
        </button>
      </div>
    );
  }

  return (
    <CriarEmpresaDashboard
      initialCompany={empresa}
      onRedirect={() => router.push("/admin/dashboard?Page=empresas")}
    />
  );
}

import { Suspense } from "react";
import CategoriasDashboard from "./_components/CategoriasDashboard";
import EmpresasDashboard from "./_components/EmpresasDashboard";
import CadastroEmpresaPage from "./_components/CadastroEmpresaPage";
import VisaoGeral from "./_components/VisaoGeral";

interface PageProps {
  searchParams: Promise<{
    Page?: string;
    Empresa?: string;
  }>;
}

export default function Page({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div className="flex-1 p-6">Carregando...</div>}>
      <DashboardContent searchParams={searchParams} />
    </Suspense>
  );
}

async function DashboardContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = params.Page ?? "Dashboard";

  switch (page) {
    case "empresas":
      return <EmpresasDashboard />;

    case "categorias":
      return <CategoriasDashboard />;

    case "cadastro":
      return <CadastroEmpresaPage empresaId={params.Empresa} />;

    case "Dashboard":
    default:
      return <VisaoGeral />;
  }
}

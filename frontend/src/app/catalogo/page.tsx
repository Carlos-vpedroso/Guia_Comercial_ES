"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowDownUp,
  Check,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Store,
  Sparkles,
  RotateCcw,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

import Container from "@/components/Container";
import { useAuth } from "@/hook/useAuth";
import { ApplicationContext } from "@/context/ApplicationContext";
import type { Ordenacao } from "@/context/ApplicationContext";
import type { Company } from "@/types/Company";
import { categoriesIcons } from "@/constants/categoriesIcons";
import Loading from "./loading";
import { useRouter, useSearchParams } from "next/navigation";

function EmpresaCard({ empresa }: { empresa: Company }) {
  const CategoryIcon = empresa.category?.slug
    ? (categoriesIcons[empresa.category.slug] ?? Store)
    : Store;

  return (
    <Link
      href={`/empresas/${empresa.slug}`}
      className="group bg-card hover:shadow-fundo2/5 flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-lg"
    >
      {/* Imagem da empresa */}
      <div className="bg-fundo relative flex aspect-video items-center justify-center overflow-hidden">
        {empresa.images?.[0]?.url ? (
          <Image
            src={empresa.images[0].url}
            alt={empresa.name}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="text-marca/70 flex h-full w-full flex-col items-center justify-center gap-2">
            <CategoryIcon className="h-10 w-10" />
            <span className="px-4 text-center text-sm font-medium">
              {empresa.name}
            </span>
          </div>
        )}

        {empresa.isHighlighted && (
          <span className="bg-card/95 text-marca absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            Em destaque
          </span>
        )}

        {empresa.category?.name && (
          <span className="bg-card/95 text-text absolute right-3 bottom-3 rounded-lg px-2.5 py-1.5 text-xs font-semibold">
            {empresa.category.name}
          </span>
        )}
      </div>

      {/* Informações da empresa */}
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="font-title text-text group-hover:text-marca text-lg leading-snug font-bold transition-colors">
          {empresa.name}
        </h3>

        <p className="text-text/60 line-clamp-3 text-sm leading-6">
          {empresa.description}
        </p>

        <div className="text-text/55 mt-auto flex items-start gap-2 pt-2 text-sm">
          <MapPin className="text-marca mt-0.5 h-4 w-4 shrink-0" />

          <span className="min-w-0">
            {empresa.address?.neighborhood
              ? `${empresa.address.neighborhood}, `
              : ""}
            {empresa.address?.city ?? "Cidade não informada"}
            {empresa.address?.state ? ` - ${empresa.address.state}` : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function Catalogo() {
  const {
    companies,
    categories,
    loading,
    filteredCompanies,
    searchTerm,
    searchCompanies,
    selectedCategory,
    setSelectedCategory,
    selectedCity,
    setSelectedCity,
    sortOrder,
    setSortOrder,
    clearFilters,
  } = useAuth(ApplicationContext);

  const router = useRouter();
  const searchParams = useSearchParams();

  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  const categoriaParam = searchParams.get("categoria");

  // Sincroniza a categoria da URL com o filtro global.
  useEffect(() => {
    if (!categoriaParam) {
      setSelectedCategory("Todas");
      return;
    }

    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLocaleLowerCase("pt-BR")
        .trim();

    const categoriaEncontrada = categories.find(
      (item) =>
        normalize(item.slug) === normalize(categoriaParam) ||
        normalize(item.name) === normalize(categoriaParam),
    );

    setSelectedCategory(categoriaEncontrada?.name ?? "Todas");
  }, [categoriaParam, categories, setSelectedCategory]);

  // Lista de cidades disponível nos filtros.
  const cidades = useMemo(
    () =>
      [
        ...new Set(
          companies
            .map((empresa) => empresa.address?.city)
            .filter((city): city is string => Boolean(city)),
        ),
      ].sort((a, b) => a.localeCompare(b, "pt-BR")),
    [companies],
  );

  const filtrosAtivos =
    selectedCategory !== "Todas" ||
    selectedCity !== "Todas" ||
    searchTerm.trim() !== "";

  function limparFiltros() {
    clearFilters();
    setFiltrosAbertos(false);
    router.replace("/catalogo", { scroll: false });
  }

  function alterarCategoria(nomeCategoria: string) {
    setSelectedCategory(nomeCategoria);

    // Ao escolher outra categoria manualmente, remove a categoria
    // anterior da URL para evitar que ela volte pelo parâmetro.
    router.replace("/catalogo", { scroll: false });
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <section className="flex w-full px-2 py-8 lg:px-6">
        <div className="flex flex-1 flex-col gap-6 lg:flex-row lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="font-title text-text text-4xl font-extrabold tracking-tight lg:text-7xl">
              Catálogo
            </h2>

            <p className="text-text/60 mt-4 max-w-xl text-sm leading-7 lg:text-base">
              Explore empresas, descubra novos serviços e encontre os melhores
              negócios para atender às suas necessidades.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-marca/10 text-marca flex h-12 w-12 items-center justify-center rounded-xl">
              <Store className="h-6 w-6" />
            </div>

            <div>
              <p className="font-title text-text text-2xl leading-tight font-bold">
                {companies.length}
              </p>

              <p className="text-text/60 mt-1 text-xs font-medium sm:text-sm">
                Empresas cadastradas
              </p>
            </div>
          </div>
        </div>
      </section>

      <Container maxWidth={false}>
        <main className="px-2 pb-8 lg:px-6">
          <section>
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
              {/* Filtros desktop */}
              <aside className="border-text/10 bg-card hidden h-fit rounded-2xl border p-5 lg:block">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="text-marca h-4 w-4" />

                    <h3 className="font-title text-text text-lg font-bold">
                      Filtros
                    </h3>
                  </div>

                  {filtrosAtivos && (
                    <button
                      type="button"
                      onClick={limparFiltros}
                      className="text-marca text-xs font-semibold"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="mt-5 space-y-5">
                  {/* Cidade */}
                  <div>
                    <label
                      htmlFor="filtro-cidade"
                      className="text-text mb-2 block text-sm font-semibold"
                    >
                      Cidade
                    </label>

                    <div className="relative">
                      <MapPin className="text-marca pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                      <select
                        id="filtro-cidade"
                        value={selectedCity}
                        onChange={(event) =>
                          setSelectedCity(event.target.value)
                        }
                        className="border-text/10 bg-fundo/50 text-text focus:border-marca h-11 w-full appearance-none rounded-xl border pr-9 pl-9 text-sm transition-colors outline-none"
                      >
                        <option value="Todas">Todas as cidades</option>

                        {cidades.map((nomeCidade) => (
                          <option key={nomeCidade} value={nomeCidade}>
                            {nomeCidade}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="text-text/50 pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                    </div>
                  </div>

                  {/* Categorias */}
                  <div className="border-text/10 border-t pt-5">
                    <p className="text-text mb-3 text-sm font-semibold">
                      Categoria
                    </p>

                    <div className="space-y-1">
                      {categories
                        .filter((item) => item.name !== "Todas")
                        .map((item) => {
                          const Icon = categoriesIcons[item.slug] ?? Store;

                          const isSelected = selectedCategory === item.name;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() =>
                                alterarCategoria(
                                  isSelected ? "Todas" : item.name,
                                )
                              }
                              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                                isSelected
                                  ? "bg-marca1/20 text-marca font-semibold"
                                  : "text-text/65 hover:bg-fundo hover:text-text"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
                              </div>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  {/* Ordenação */}
                  <div className="border-text/10 border-t pt-5">
                    <label
                      htmlFor="ordenacao-desktop"
                      className="text-text mb-2 block text-sm font-semibold"
                    >
                      Ordenar por
                    </label>

                    <div className="relative">
                      <ArrowDownUp className="text-marca pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                      <select
                        id="ordenacao-desktop"
                        value={sortOrder}
                        onChange={(event) =>
                          setSortOrder(event.target.value as Ordenacao)
                        }
                        className="border-text/10 bg-fundo/50 text-text focus:border-marca h-11 w-full appearance-none rounded-xl border pr-9 pl-9 text-sm outline-none"
                      >
                        <option value="relevancia">Relevância</option>
                        <option value="nome">Nome (A–Z)</option>
                      </select>

                      <ChevronDown className="text-text/50 pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
              </aside>

              {/* Resultados */}
              <div className="min-w-0">
                <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-text/60 text-sm">
                      Encontramos{" "}
                      <strong className="text-text">
                        {filteredCompanies.length}
                      </strong>{" "}
                      {filteredCompanies.length === 1 ? "empresa" : "empresas"}
                    </p>

                    {filtrosAtivos && (
                      <p className="text-text/45 mt-1 text-xs">
                        Resultados de acordo com os filtros selecionados.
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setFiltrosAbertos(!filtrosAbertos)}
                    aria-expanded={filtrosAbertos}
                    className="border-text/10 text-text/70 hover:bg-fundo inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filtros
                  </button>
                </div>

                {filteredCompanies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {filteredCompanies.map((empresa) => (
                      <EmpresaCard key={empresa.id} empresa={empresa} />
                    ))}
                  </div>
                ) : (
                  <div className="border-marca1/40 bg-fundo/40 flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-12 text-center">
                    <div className="bg-marca1/20 text-marca flex h-16 w-16 items-center justify-center rounded-2xl">
                      <Search className="h-7 w-7" />
                    </div>

                    <h3 className="font-title text-text mt-5 text-xl font-bold">
                      Nenhuma empresa encontrada
                    </h3>

                    <p className="text-text/60 mt-2 max-w-md text-sm leading-6">
                      Não encontramos empresas com esses critérios. Experimente
                      outra busca ou remova alguns filtros.
                    </p>

                    <button
                      type="button"
                      onClick={limparFiltros}
                      className="bg-marca text-text2 hover:bg-marca1 mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition-colors"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Limpar filtros
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </Container>

      {/* Painel de filtros mobile */}
      <Sheet open={filtrosAbertos} onOpenChange={setFiltrosAbertos}>
        <SheetContent
          side="right"
          className="bg-card text-text flex w-full flex-col gap-0"
        >
          <SheetHeader className="border-text/10 border-b px-5 py-5 text-left">
            <div>
              <SheetTitle className="font-title text-text text-xl font-bold">
                Filtrar empresas
              </SheetTitle>

              <SheetDescription className="text-text/60 mt-1 text-sm">
                Refine sua busca para encontrar o negócio ideal.
              </SheetDescription>
            </div>
          </SheetHeader>

          <div className="flex-1 space-y-6 overflow-y-auto px-5 py-6">
            {/* Cidade */}
            <div>
              <label
                htmlFor="filtro-cidade-mobile"
                className="text-text mb-2 block text-sm font-semibold"
              >
                Cidade
              </label>

              <div className="relative">
                <MapPin className="text-marca pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                <select
                  id="filtro-cidade-mobile"
                  value={selectedCity}
                  onChange={(event) => setSelectedCity(event.target.value)}
                  className="border-text/10 bg-fundo/50 text-text focus:border-marca h-12 w-full appearance-none rounded-xl border pr-9 pl-10 text-sm outline-none"
                >
                  <option value="Todas">Todas as cidades</option>

                  {cidades.map((nomeCidade) => (
                    <option key={nomeCidade} value={nomeCidade}>
                      {nomeCidade}
                    </option>
                  ))}
                </select>

                <ChevronDown className="text-text/50 pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>

            {/* Categoria */}
            <div>
              <label
                htmlFor="filtro-categoria-mobile"
                className="text-text mb-2 block text-sm font-semibold"
              >
                Categoria
              </label>

              <div className="relative">
                <Store className="text-marca pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                <select
                  id="filtro-categoria-mobile"
                  value={selectedCategory}
                  onChange={(event) => alterarCategoria(event.target.value)}
                  className="border-text/10 bg-fundo/50 text-text focus:border-marca h-12 w-full appearance-none rounded-xl border pr-9 pl-10 text-sm outline-none"
                >
                  <option value="Todas">Todas as categorias</option>

                  {categories
                    .filter((item) => item.name !== "Todas")
                    .map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                </select>

                <ChevronDown className="text-text/50 pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>

            {/* Ordenação */}
            <div>
              <label
                htmlFor="filtro-ordenacao-mobile"
                className="text-text mb-2 block text-sm font-semibold"
              >
                Ordenar resultados por
              </label>

              <div className="relative">
                <ArrowDownUp className="text-marca pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />

                <select
                  id="filtro-ordenacao-mobile"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value as Ordenacao)
                  }
                  className="border-text/10 bg-fundo/50 text-text focus:border-marca h-12 w-full appearance-none rounded-xl border pr-9 pl-10 text-sm outline-none"
                >
                  <option value="relevancia">Relevância</option>
                  <option value="nome">Nome (A–Z)</option>
                </select>

                <ChevronDown className="text-text/50 pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
              </div>
            </div>

            {/* Limpar filtros */}
            {filtrosAtivos && (
              <button
                type="button"
                onClick={limparFiltros}
                className="text-marca hover:text-marca1 inline-flex items-center gap-2 text-sm font-semibold transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Limpar todos os filtros
              </button>
            )}
          </div>

          {/* Rodapé */}
          <SheetFooter className="border-text/10 bg-card border-t p-5">
            <div className="flex w-full flex-col gap-3">
              <SheetClose className="bg-marca text-text2 hover:bg-marca1 h-12 w-full rounded-xl font-semibold">
                Ver {filteredCompanies.length}{" "}
                {filteredCompanies.length === 1 ? "empresa" : "empresas"}
              </SheetClose>

              <SheetClose className="text-text/60 hover:bg-fundo hover:text-text w-full">
                Fechar filtros
              </SheetClose>
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

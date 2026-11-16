"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Building2,
  MapPin,
  Star,
  Tags,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
  CalendarDays,
  ArrowUpDown,
} from "lucide-react";

import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";
import { categoriesIcons } from "@/constants/categoriesIcons";

import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useRouter } from "next/navigation";

type StatusFilter = "todos" | "ativos" | "inativos";
type HighlightFilter = "todos" | "destacados" | "normais";

export default function EmpresasDashboard() {
  const { companies, categories, loading } = useAuth(ApplicationContext);
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("todas");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [highlightFilter, setHighlightFilter] =
    useState<HighlightFilter>("todos");
  const [sortOrder, setSortOrder] = useState<"recentes" | "antigas" | "nome">(
    "recentes",
  );
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 10000,
      stopOnInteraction: false,
    }),
  );

  const filteredCompanies = useMemo(() => {
    return companies
      .filter((company) => {
        const searchTerm = search.trim().toLocaleLowerCase("pt-BR");

        const matchesSearch =
          !searchTerm ||
          company.name.toLocaleLowerCase("pt-BR").includes(searchTerm) ||
          company.address.city
            .toLocaleLowerCase("pt-BR")
            .includes(searchTerm) ||
          company.category?.name
            .toLocaleLowerCase("pt-BR")
            .includes(searchTerm);

        const matchesCategory =
          categoryFilter === "todas" ||
          company.categoryId.toString() === categoryFilter;

        const matchesStatus =
          statusFilter === "todos" ||
          (statusFilter === "ativos" && company.isActive) ||
          (statusFilter === "inativos" && !company.isActive);

        const matchesHighlight =
          highlightFilter === "todos" ||
          (highlightFilter === "destacados" && company.isHighlighted) ||
          (highlightFilter === "normais" && !company.isHighlighted);

        return (
          matchesSearch && matchesCategory && matchesStatus && matchesHighlight
        );
      })
      .sort((a, b) => {
        if (sortOrder === "nome") {
          return a.name.localeCompare(b.name, "pt-BR");
        }

        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return sortOrder === "recentes" ? dateB - dateA : dateA - dateB;
      });
  }, [
    companies,
    search,
    categoryFilter,
    statusFilter,
    highlightFilter,
    sortOrder,
  ]);

  return (
    <section className="bg-fundo min-h-screen min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="font-title text-fundo2 text-3xl font-bold lg:text-4xl">
            Empresas
          </h1>
        </div>

        <div className="border-border bg-text1 text-fundo2 flex w-fit items-center gap-2 rounded-xl border px-4 py-3 text-sm">
          <Building2 size={18} className="text-marca" />
          <span>
            Total de empresas:{" "}
            <strong>{loading ? "—" : companies.length}</strong>
          </span>
        </div>
      </div>

      {/* Filtros */}
      <div className="border-border bg-card mb-6 rounded-2xl border p-4 sm:p-5">
        <div className="mb-4 flex items-center gap-2">
          <SlidersHorizontal size={19} className="text-marca" />
          <h2 className="text-fundo2 font-semibold">Filtros e pesquisa</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {/* Busca */}
          <div className="relative">
            <Search
              size={18}
              className="text-fundo2/50 absolute top-1/2 left-3 -translate-y-1/2"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar empresa ou cidade..."
              className="border-border bg-card text-fundo2 placeholder:text-fundo2/45 focus:border-marca focus:ring-marca/15 h-11 w-full rounded-xl border pr-4 pl-10 text-sm transition outline-none focus:ring-2"
            />
          </div>

          {/* Categoria */}
          <div className="relative">
            <Tags
              size={18}
              className="text-marca absolute top-1/2 left-3 -translate-y-1/2"
            />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
              className="border-border bg-card text-fundo2 focus:border-marca focus:ring-marca/15 h-11 w-full appearance-none rounded-xl border pr-4 pl-10 text-sm transition outline-none focus:ring-2"
            >
              <option value="todas">Todas as categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={String(category.id)}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            aria-label="Filtrar por situação"
            className="border-border bg-card text-fundo2 focus:border-marca focus:ring-marca/15 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2"
          >
            <option value="todos">Todos os status</option>
            <option value="ativos">Somente ativas</option>
            <option value="inativos">Somente inativas</option>
          </select>

          {/* Destaque */}
          <select
            value={highlightFilter}
            onChange={(event) =>
              setHighlightFilter(event.target.value as HighlightFilter)
            }
            aria-label="Filtrar por destaque"
            className="border-border bg-card text-fundo2 focus:border-marca focus:ring-marca/15 h-11 w-full rounded-xl border px-4 text-sm transition outline-none focus:ring-2"
          >
            <option value="todos">Com e sem destaque</option>
            <option value="destacados">Somente em destaque</option>
            <option value="normais">Sem destaque</option>
          </select>
        </div>

        <div className="border-border mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fundo2/65 text-sm">
            {loading
              ? "Carregando empresas..."
              : `${filteredCompanies.length} ${
                  filteredCompanies.length === 1
                    ? "empresa encontrada"
                    : "empresas encontradas"
                }`}
          </p>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={16} className="text-marca shrink-0" />
            <label
              htmlFor="sort-companies"
              className="text-fundo2/70 shrink-0 text-sm"
            >
              Ordenar:
            </label>
            <select
              id="sort-companies"
              value={sortOrder}
              onChange={(event) =>
                setSortOrder(
                  event.target.value as "recentes" | "antigas" | "nome",
                )
              }
              className="border-border bg-fundo text-fundo2 focus:border-marca h-10 min-w-0 rounded-lg border px-3 text-sm outline-none"
            >
              <option value="recentes">Mais recentes</option>
              <option value="antigas">Mais antigas</option>
              <option value="nome">Nome (A–Z)</option>
            </select>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("todas");
                setStatusFilter("todos");
                setHighlightFilter("todos");
                setSortOrder("recentes");
              }}
              className="text-marca hover:bg-marca1/20 shrink-0 rounded-lg px-3 py-2 text-sm font-semibold transition"
            >
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Lista de empresas */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {loading ? (
          <div className="border-border bg-text1 rounded-2xl border p-10 text-center">
            <div className="border-border border-t-marca mx-auto mb-3 h-7 w-7 animate-spin rounded-full border-2" />
            <p className="text-fundo2/65 text-sm">
              Carregando empresas cadastradas...
            </p>
          </div>
        ) : filteredCompanies.length === 0 ? (
          <div className="border-border bg-text1 rounded-2xl border px-5 py-12 text-center">
            <div className="bg-marca1/20 text-marca mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl">
              <Building2 size={27} />
            </div>
            <h3 className="font-title text-fundo2 text-lg font-bold">
              Nenhuma empresa encontrada
            </h3>
            <p className="text-fundo2/65 mx-auto mt-2 max-w-md text-sm">
              Não encontramos empresas com os filtros selecionados. Tente
              alterar a busca ou limpar os filtros.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategoryFilter("todas");
                setStatusFilter("todos");
                setHighlightFilter("todos");
              }}
              className="bg-marca text-text1 mt-5 rounded-xl px-4 py-2.5 text-sm font-semibold transition hover:opacity-90"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          filteredCompanies.map((company) => {
            const Icon =
              categoriesIcons[company.category?.slug ?? ""] ?? Building2;

            // Aceita tanto um array de URLs quanto objetos com a propriedade url.
            const images = (company.images ?? [])
              .map((image) => (typeof image === "string" ? image : image.url))
              .filter((url): url is string => Boolean(url));

            return (
              <article
                key={company.id}
                onClick={() =>
                  router.push(
                    `/admin/dashboard?Page=cadastro&Empresa=${company.id}`,
                  )
                }
                className="border-border bg-card hover:border-fundo2 flex min-w-0 cursor-pointer flex-col overflow-hidden rounded-2xl border shadow-sm transition"
              >
                {/* Carrossel de imagens */}
                <div className="relative">
                  {images.length > 0 ? (
                    <Carousel
                      opts={{
                        align: "start",
                        loop: images.length > 1,
                      }}
                      plugins={images.length > 1 ? [autoplay] : []}
                      className="w-full"
                    >
                      <CarouselContent className="ml-0">
                        {images.map((image, index) => (
                          <CarouselItem
                            key={`${company.id}-${index}`}
                            className="basis-full pl-0"
                          >
                            <div className="bg-fundo relative aspect-[16/10] w-full">
                              <Image
                                src={image}
                                alt={`${company.name} - imagem ${index + 1}`}
                                fill
                                sizes="(max-width: 1023px) 100vw, 33vw"
                                className="object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  ) : (
                    <div className="bg-fundo text-marca flex aspect-[16/10] w-full items-center justify-center">
                      <Icon size={48} strokeWidth={1.3} />
                    </div>
                  )}

                  {/* Indicador de destaque */}
                  {company.isHighlighted && (
                    <span className="bg-marca2 text-text2 absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm">
                      <Star size={13} />
                      Em destaque
                    </span>
                  )}
                </div>

                {/* Conteúdo do card */}
                <div className="flex flex-1 flex-col p-4">
                  {/* Nome e status */}
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-title text-fundo2 min-w-0 flex-1 text-lg leading-tight font-bold">
                      {company.name}
                    </h3>

                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        company.isActive
                          ? "bg-marca1/25 text-fundo2"
                          : "bg-fundo2/10 text-fundo2/65"
                      }`}
                    >
                      {company.isActive ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <XCircle size={12} />
                      )}

                      {company.isActive ? "Ativa" : "Inativa"}
                    </span>
                  </div>

                  {/* Categoria */}
                  <div className="text-marca mt-3 flex items-center gap-2 text-sm font-medium">
                    <Icon size={16} className="shrink-0" />
                    <span>{company.category?.name ?? "Sem categoria"}</span>
                  </div>

                  {/* Descrição */}
                  <p className="text-fundo2/70 mt-3 line-clamp-3 text-sm leading-relaxed">
                    {company.description || "Nenhuma descrição cadastrada."}
                  </p>

                  {/* Localização */}
                  <div className="text-fundo2/65 mt-4 flex items-start gap-2 text-sm">
                    <MapPin size={16} className="text-marca mt-0.5 shrink-0" />
                    <span>
                      {company.address.city}, {company.address.state}
                    </span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

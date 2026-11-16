"use client";

import { useMemo } from "react";
import {
  Building2,
  CheckCircle2,
  Star,
  Tags,
  MapPin,
  TrendingUp,
  Clock3,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { useAuth } from "@/hook/useAuth";
import { ApplicationContext } from "@/context/ApplicationContext";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const monthlyChartConfig = {
  total: {
    label: "Empresas cadastradas",
    color: "#f37c1f",
  },
} satisfies ChartConfig;

const categoryChartConfig = {
  total: {
    label: "Empresas",
    color: "#e4b066",
  },
} satisfies ChartConfig;

function getMonthKey(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}`;
}

function formatMonth(year: number, month: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
  })
    .format(new Date(year, month, 1))
    .replace(".", "");
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function VisaoGeral() {
  const { companies, categories, loading } = useAuth(ApplicationContext);

  const dashboard = useMemo(() => {
    const activeCompanies = companies.filter((company) => company.isActive);

    const highlightedCompanies = companies.filter(
      (company) => company.isHighlighted,
    );

    // Últimos 6 meses, incluindo o mês atual.
    const currentDate = new Date();

    const monthlyData = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - (5 - index),
        1,
      );

      const year = date.getFullYear();
      const month = date.getMonth();
      const key = getMonthKey(year, month);

      return {
        key,
        month: formatMonth(year, month),
        total: 0,
      };
    });

    const monthlyIndex = new Map(
      monthlyData.map((item, index) => [item.key, index]),
    );

    companies.forEach((company) => {
      if (!company.createdAt) return;

      const datePart = company.createdAt.slice(0, 7);
      const index = monthlyIndex.get(datePart);

      if (index !== undefined) {
        monthlyData[index].total += 1;
      }
    });

    // Distribuição por categoria calculada pelas empresas carregadas.
    const categoryCounts = new Map<string, number>();

    companies.forEach((company) => {
      const categoryName = company.category?.name;

      if (categoryName) {
        categoryCounts.set(
          categoryName,
          (categoryCounts.get(categoryName) ?? 0) + 1,
        );
      }
    });

    const categoryData = Array.from(categoryCounts.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);

    // Cidades com mais empresas cadastradas.
    const cityCounts = new Map<string, number>();

    companies.forEach((company) => {
      const city = company.address?.city?.trim();

      if (city) {
        cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
      }
    });

    const cityData = Array.from(cityCounts.entries())
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const recentCompanies = [...companies]
      .sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        return dateB - dateA;
      })
      .slice(0, 5);

    return {
      totalCompanies: companies.length,
      activeCompanies: activeCompanies.length,
      inactiveCompanies: companies.length - activeCompanies.length,
      highlightedCompanies: highlightedCompanies.length,
      totalCategories: categories.length,
      monthlyData,
      categoryData,
      cityData,
      recentCompanies,
    };
  }, [companies, categories]);

  const cards = [
    {
      title: "Total de empresas",
      value: dashboard.totalCompanies,
      description: "Empresas cadastradas no guia",
      icon: Building2,
    },
    {
      title: "Empresas ativas",
      value: dashboard.activeCompanies,
      description: "Visíveis conforme o status de ativação",
      icon: CheckCircle2,
    },
    {
      title: "Em destaque",
      value: dashboard.highlightedCompanies,
      description: "Empresas marcadas para destaque",
      icon: Star,
    },
    {
      title: "Categorias",
      value: dashboard.totalCategories,
      description: "Categorias disponíveis no guia",
      icon: Tags,
    },
  ];

  if (loading) {
    return (
      <div className="text-text2 flex min-h-64 items-center justify-center">
        Carregando visão geral...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex-1 space-y-6 p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-title text-fundo2 text-3xl font-bold lg:text-4xl">
            Visão geral
          </h1>
        </div>

        <div className="text-text/70 flex items-center gap-2 text-sm">
          <Clock3 className="text-marca h-4 w-4" />
          Atualizado com os dados carregados
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((item) => {
          const Icon = item.icon;

          return (
            <Card
              key={item.title}
              className="bg-card shadow-sm"
            >
              <CardContent className="flex items-start justify-between gap-3 p-5">
                <div className="space-y-2">
                  <p className="text-text/70 text-sm font-medium font-title">
                    {item.title}
                  </p>

                  <p className="text-text text-3xl font-bold">{item.value}</p>

                  <p className="text-text/60 text-xs">{item.description}</p>
                </div>

                <div className="bg-marca/10 rounded-xl p-3">
                  <Icon className="text-marca h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Gráfico mensal */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <div className="flex items-start gap-3">
            <div className="bg-marca/10 rounded-lg p-2">
              <TrendingUp className="text-marca h-5 w-5" />
            </div>

            <div>
              <CardTitle className="text-text font-title">Cadastros por mês</CardTitle>
              <CardDescription className="text-text/60 mt-1">
                Quantidade de novas empresas nos últimos seis meses.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <ChartContainer
            config={monthlyChartConfig}
            className="h-[280px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={dashboard.monthlyData}
              margin={{ top: 12, right: 12, left: -16, bottom: 0 }}
            >
              <CartesianGrid
                vertical={false}
                stroke="#e4b066"
                strokeDasharray="3 3"
              />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />

              <YAxis allowDecimals={false} tickLine={false} axisLine={false} />

              <ChartTooltip
                cursor={{ fill: "#e4b066", opacity: 0.15 }}
                content={<ChartTooltipContent />}
              />

              <Bar
                dataKey="total"
                fill="var(--color-total)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Distribuição e cidades */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-text font-title">Empresas por categoria</CardTitle>
            <CardDescription className="text-text/60">
              Até oito categorias com mais empresas cadastradas.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {dashboard.categoryData.length === 0 ? (
              <p className="text-text2/60 py-8 text-center text-sm">
                Ainda não existem empresas com categoria definida.
              </p>
            ) : (
              <ChartContainer
                config={categoryChartConfig}
                className="h-[300px] w-full"
              >
                <BarChart
                  accessibilityLayer
                  data={dashboard.categoryData}
                  layout="vertical"
                  margin={{ top: 4, right: 12, left: 8, bottom: 4 }}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="#e4b066"
                    strokeDasharray="3 3"
                  />

                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={145}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11 }}
                  />

                  <ChartTooltip
                    cursor={{ fill: "#e4b066", opacity: 0.15 }}
                    content={<ChartTooltipContent />}
                  />

                  <Bar
                    dataKey="total"
                    fill="var(--color-total)"
                    radius={[0, 6, 6, 0]}
                  />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-text font-title">Empresas por cidade</CardTitle>
            </div>

            <CardDescription className="text-text/60">
              Cidades com maior quantidade de empresas cadastradas.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {dashboard.cityData.length === 0 ? (
              <p className="text-text/60 py-8 text-center text-sm">
                Ainda não existem cidades para exibir.
              </p>
            ) : (
              dashboard.cityData.map((city, index) => {
                const percentage =
                  dashboard.totalCompanies > 0
                    ? (city.total / dashboard.totalCompanies) * 100
                    : 0;

                return (
                  <div key={city.name} className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="bg-marca/10 text-marca flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold">
                          {index + 1}
                        </span>

                        <span className="text-text truncate text-sm font-medium">
                          {city.name}
                        </span>
                      </div>

                      <span className="text-text shrink-0 text-sm font-semibold">
                        {city.total}
                        {city.total === 1 ? " empresa" : " empresas"}
                      </span>
                    </div>

                    <div className="bg-marca1/30 h-2 overflow-hidden rounded-full">
                      <div
                        className="bg-marca h-full rounded-full transition-all"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>
      </div>

      {/* Cadastros recentes */}
      <Card className="bg-card shadow-sm">
        <CardHeader>
          <CardTitle className="text-text font-title">Cadastros recentes</CardTitle>
          <CardDescription className="text-text/60">
            As cinco empresas cadastradas mais recentemente.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {dashboard.recentCompanies.length === 0 ? (
            <p className="text-text/60 py-8 text-center text-sm">
              Nenhuma empresa cadastrada ainda.
            </p>
          ) : (
            <div className="space-y-4">
              {dashboard.recentCompanies.map((company) => (
                <div
                  key={company.id}
                  className="border-marca1/30 flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="bg-marca/10 rounded-lg p-2">
                      <Building2 className="text-marca h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-text truncate font-medium">
                        {company.name}
                      </p>

                      <p className="text-text/60 text-sm">
                        {company.category?.name ?? "Sem categoria"}
                        {" · "}
                        {company.address?.city ?? "Cidade não informada"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        company.isActive
                          ? "bg-marca/10 text-marca"
                          : "bg-fundo2/10 text-text2/70"
                      }`}
                    >
                      {company.isActive ? "Ativa" : "Inativa"}
                    </span>

                    {company.isHighlighted && (
                      <span className="bg-marca2/30 text-text2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium">
                        <Star className="h-3 w-3" />
                        Destaque
                      </span>
                    )}

                    {company.createdAt && (
                      <span className="text-text/60 text-xs">
                        {formatDate(company.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

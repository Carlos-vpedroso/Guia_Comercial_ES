"use client";

import { Tags, Building2, CalendarDays, LoaderCircle } from "lucide-react";

import { categoriesIcons } from "@/constants/categoriesIcons";
import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";

export default function CategoriasDashboard() {
  const { categories, loading } = useAuth(ApplicationContext);

  return (
    <section className="min-h-screen flex-1 p-6 lg:p-8">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="font-title text-fundo2 text-3xl font-bold lg:text-4xl">
          Categorias
        </h1>

        <p className="text-fundo2/60 mt-2 text-sm">
          Visualize as categorias cadastradas no Guia Comercial ES.
        </p>
      </div>

      {/* Lista de categorias */}
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-title text-fundo2 text-lg font-bold">
          Categorias cadastradas
        </h2>

        {!loading && (
          <span className="bg-marca/10 text-marca rounded-full px-3 py-1 text-xs font-semibold">
            {categories.length} categorias
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex min-h-48 items-center justify-center">
          <LoaderCircle className="text-marca h-8 w-8 animate-spin" />
        </div>
      ) : categories.length === 0 ? (
        <div className="border-marca1/50 bg-text1 rounded-2xl border border-dashed p-10 text-center">
          <Tags className="text-marca1 mx-auto mb-3 h-10 w-10" />

          <h3 className="text-fundo2 font-semibold">
            Nenhuma categoria cadastrada
          </h3>

          <p className="text-fundo2/60 mt-1 text-sm">
            As categorias disponíveis aparecerão aqui.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => {
            const Icon = categoriesIcons[category.slug] ?? Tags;

            return (
              <article
                key={category.id}
                className="group border-marca1/30 bg-card hover:border-marca/50 hover:shadow-marca/5 rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg"
              >
                <div className="mb-5 flex items-start justify-between">
                  <div className="bg-marca/10 text-marca group-hover:bg-marca flex h-12 w-12 items-center justify-center rounded-xl transition-colors group-hover:text-white">
                    <Icon size={24} strokeWidth={1.8} />
                  </div>

                  <span className="bg-marca1/20 text-fundo2/70 rounded-lg px-2.5 py-1 text-xs font-medium">
                    ID #{category.id}
                  </span>
                </div>

                <h3 className="font-title text-fundo2 text-lg font-bold">
                  {category.name}
                </h3>

                <p className="text-fundo2/50 mt-1 text-xs">{category.slug}</p>

                <div className="border-marca1/20 mt-5 flex items-center justify-between border-t pt-4">
                  <div className="text-fundo2/60 flex items-center gap-2 text-sm">
                    <Building2 size={16} />
                    <span>Empresas</span>
                  </div>

                  <span className="text-marca font-semibold">
                    {category.companiesCount}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

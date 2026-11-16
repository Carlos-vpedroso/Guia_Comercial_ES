"use client";
import Link from "next/link";

import Container from "@/components/Container";
import { motion } from "framer-motion";
import {
  fadeInDown,
  fadeInUpSmall,
  staggerGrid,
} from "@/constants/motionVariants";
import ButtonLink from "@/components/ButtonLink";
import { categoriesIcons } from "@/constants/categoriesIcons";
import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";

function CategoriasSkeleton() {
  return (
    <div
      aria-label="Carregando categorias"
      aria-busy="true"
      className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
    >
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="border-marca2/20 flex min-h-40 flex-col justify-between rounded-2xl border p-5 shadow-sm"
        >
          {/* Ícone e quantidade */}
          <div className="flex items-center justify-between">
            <div className="bg-marca2/10 h-11 w-11 animate-pulse rounded-xl" />

            <div className="bg-marca2/10 h-3 w-16 animate-pulse rounded-full" />
          </div>

          {/* Nome da categoria */}
          <div className="space-y-2">
            <div className="bg-marca2/10 h-5 w-3/4 animate-pulse rounded-md" />
            <div className="bg-marca2/10 h-5 w-1/2 animate-pulse rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Categorias() {
  const { categories, loading } = useAuth(ApplicationContext);
  return (
    <section id="categorias" className="px-2 py-8 lg:px-6">
      <Container minHeight={false}>
        {/* Header */}
        <motion.div
          variants={fadeInDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-end justify-between gap-6"
        >
          <h1 className="font-title max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight lg:max-w-none lg:text-7xl">
            Escolha por onde começar
          </h1>

          <p className="font-text text-text/60 hidden text-sm lg:block">
            Encontre empresas por categoria
          </p>
        </motion.div>

        {/* Categorias */}
        {loading ? (
          <CategoriasSkeleton />
        ) : (
          <motion.div
            variants={staggerGrid}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5"
          >
            {categories.map((category) => {
              const Icon = categoriesIcons[category.slug];

              return (
                <motion.div key={category.id} variants={fadeInUpSmall}>
                  <Link
                    href={`/catalogo?categoria=${encodeURIComponent(category.slug)}`}
                    className="group border-marca2/20 hover:border-marca2/40 relative flex min-h-40 flex-col justify-between overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="bg-marca2/10 text-marca2 group-hover:bg-marca3 group-hover:text-text2 flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300">
                        {Icon && (
                          <Icon className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                        )}
                      </div>

                      {category.companiesCount != null && (
                        <span className="text-marca2/50 text-xs font-semibold">
                          {category.companiesCount} empresas
                        </span>
                      )}
                    </div>

                    <h2 className="font-title text-text mt-1 text-xl leading-tight font-bold">
                      {category.name}
                    </h2>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* BTN Catálogo Completo */}
        <motion.div
          variants={fadeInUpSmall}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 flex justify-center"
        >
          <ButtonLink href="/catalogo">Ver catálogo completo</ButtonLink>
        </motion.div>
      </Container>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/Container";
import {
  fadeInDown,
  fadeInUp,
  staggerContainer,
} from "@/constants/motionVariants";
import { ApplicationContext } from "@/context/ApplicationContext";
import { useAuth } from "@/hook/useAuth";
import { Company } from "@/types/Company";

function CompaniesSkeleton() {
  return (
    <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-fundo flex h-full flex-col overflow-hidden rounded-3xl shadow-sm"
        >
          {/* Imagem */}
          <div className="bg-text/10 relative aspect-4/3 animate-pulse" />

          {/* Conteúdo */}
          <div className="flex flex-1 flex-col p-6">
            {/* Categoria */}
            <div className="bg-text/10 h-3 w-24 animate-pulse rounded" />

            {/* Nome */}
            <div className="bg-text/10 mt-4 h-8 w-3/4 animate-pulse rounded" />

            {/* Descrição */}
            <div className="mt-4 space-y-2">
              <div className="bg-text/10 h-3 w-full animate-pulse rounded" />
              <div className="bg-text/10 h-3 w-5/6 animate-pulse rounded" />
              <div className="bg-text/10 h-3 w-2/3 animate-pulse rounded" />
            </div>

            {/* Link */}
            <div className="mt-8 flex items-center gap-2">
              <div className="bg-text/10 h-4 w-32 animate-pulse rounded" />
              <div className="bg-text/10 h-4 w-4 animate-pulse rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EmDestaque() {
  const { companies, loading } = useAuth(ApplicationContext);

  const randomCompanies = useMemo(() => {
    return [...companies].sort(() => Math.random() - 0.5).slice(0, 3);
  }, [companies]);

  return (
    <section id="destaque" className="bg-fundo2 px-2 py-8 lg:px-6 lg:py-16">
      <Container minHeight={false}>
        {/* Header */}
        <motion.div
          variants={fadeInDown}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="flex items-center justify-between"
        >
          <h1 className="font-title text-text2 max-w-3xl text-5xl leading-[1.05] font-bold tracking-tight lg:max-w-none lg:text-7xl">
            Em destaque essa semana
          </h1>

          <Link
            href="/catalogo"
            className="text-text2/60 hover:text-marca group hidden shrink-0 items-center gap-2 text-sm font-semibold transition-colors lg:flex"
          >
            Ver mais
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Empresas */}

        {loading ? (
          <CompaniesSkeleton />
        ) : (
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3"
          >
            {randomCompanies.map((empresa, index) => (
              <div key={empresa.slug}>
                <Link
                  href={`/empresas/${empresa.slug}`}
                  className="group bg-fundo relative flex h-full flex-col rounded-3xl shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Badge */}
                  <div className="absolute top-4 right-4 z-10"> 
                    <span className="bg-marca/50 text-text2 inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase shadow-lg backdrop-blur-md">
                      Nova
                    </span>
                  </div>

                  {/* Imagem */}
                  <div className="relative aspect-4/3 overflow-hidden rounded-t-3xl">
                    <Image
                      src={
                        empresa.images?.[0]?.url ??
                        `https://placehold.co/500x500/858585/ffffff?text=${encodeURIComponent(empresa.name)}`
                      }
                      alt={empresa.name}
                      fill
                      unoptimized
                      priority={index === 0}
                      loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {/* Conteúdo */}
                  <div className="flex flex-1 flex-col justify-between p-6">
                    <span className="text-marca text-xs font-semibold tracking-wide uppercase">
                      {empresa.category?.name}
                    </span>

                    <h2 className="font-title text-text mt-2 text-3xl font-bold">
                      {empresa.name}
                    </h2>

                    <p className="text-text/65 mt-3 line-clamp-3 text-sm leading-relaxed">
                      {empresa.description}
                    </p>

                    <div className="text-marca flex items-center gap-2 pt-5 text-sm font-semibold">
                      Conhecer empresa
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </motion.div>
        )}
      </Container>
    </section>
  );
}

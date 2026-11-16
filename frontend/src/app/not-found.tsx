"use client";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

import {
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/constants/motionVariants";
import ButtonLink from "@/components/ButtonLink";

export default function NotFound() {
  return (
    <main className="bg-fundo flex min-h-svh items-center justify-center px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex w-full max-w-2xl flex-col items-center text-center"
      >
        {/* 404 */}
        <motion.div variants={scaleIn}>
          <span className="font-title text-marca text-[clamp(7rem,20vw,13rem)] leading-none font-extrabold tracking-tighter">
            404
          </span>
        </motion.div>

        {/* Conteúdo */}
        <motion.div variants={fadeInUp} className="mt-4">
          <h1 className="font-title text-text text-4xl leading-tight font-bold sm:text-5xl">
            Parece que essa página
            <br />
            <span className="text-marca">não existe.</span>
          </h1>

          <p className="text-text/60 mx-auto mt-5 max-w-lg text-base leading-relaxed sm:text-lg">
            A página que você está procurando pode ter sido removida, movida ou
            o endereço pode estar incorreto.
          </p>
        </motion.div>

        {/* Ações */}
        <motion.div
          variants={fadeInUp}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <ButtonLink href="/" reverse>
            Voltar para o início
          </ButtonLink>
          <ButtonLink
            href="/catalogo"
            bgColor="bg-marca2"
            bgHover="hover:bg-marca3"
          >
            <Search className="h-4 w-4" />
            Encontrar empresas
          </ButtonLink>
        </motion.div>

        {/* Identidade */}
        <motion.p
          variants={fadeInUp}
          className="text-text/40 mt-12 text-xs font-medium tracking-[0.18em] uppercase"
        >
          Guia Comercial ES
        </motion.p>
      </motion.div>
    </main>
  );
}

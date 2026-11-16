"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

import { fadeInDown } from "@/constants/motionVariants";
import ButtonLink from "./ButtonLink";

const navigation = [
  {
    label: "Início",
    href: "#home",
  },
  {
    label: "Em destaque",
    href: "#destaque",
  },
  {
    label: "Categorias",
    href: "#categorias",
  },
  {
    label: "Informações",
    href: "#info",
  },
];

export default function Header() {
  return (
    <motion.header
      variants={fadeInDown}
      initial="hidden"
      animate="visible"
      className="w-full px-2 lg:px-6"
    >
      <div className="flex h-24 w-full items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Guia Comercial ES, página inicial"
          className="shrink-0"
        >
          <Image
            src="/Logo_COMPLETA.png"
            alt="Guia Comercial ES"
            width={500}
            height={500}
            priority
            className="h-24 w-auto object-contain"
          />
        </Link>

        {/* Navegação */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-text/60 hover:bg-fundo2/10 hover:text-text rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* BTN Ver Empresas */}
        <ButtonLink href="/catalogo">Ver empresas</ButtonLink>
      </div>
    </motion.header>
  );
}

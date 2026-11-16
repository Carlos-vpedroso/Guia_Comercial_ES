"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeInDown } from "@/constants/motionVariants";
import SearchInput from "./SearchInput";
import Container from "./Container";

export default function HeaderEmpresas() {
  return (
    <Container minHeight={false}>
      <motion.header
        variants={fadeInDown}
        initial="hidden"
        animate="visible"
        className="w-full px-2 lg:px-6"
      >
        <div className="flex h-24 w-full items-center justify-center lg:justify-between">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Guia Comercial ES, página inicial"
            className="flex shrink-0 items-center"
          >
            <Image
              src="/Logo_COMPLETA.png"
              alt="Guia Comercial ES"
              width={500}
              height={500}
              priority
              className="block h-24 w-auto object-contain"
            />
          </Link>

          {/* Search */}

          <SearchInput />
        </div>
      </motion.header>
    </Container>
  );
}

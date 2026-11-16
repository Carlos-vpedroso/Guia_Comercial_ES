"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import {
  fadeIn,
  fadeInRight,
  fadeInUp,
  scaleIn,
  staggerContainer,
} from "@/constants/motionVariants";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import SearchInput from "@/components/SearchInput";
import { useAuth } from "@/hook/useAuth";
import { ApplicationContext } from "@/context/ApplicationContext";

export default function Hero() {
  const { companies } = useAuth(ApplicationContext);

  return (
    <section id="home" className="relative overflow-hidden px-2 py-8 lg:px-6">
      <div className="grid min-h-[calc(100vh-6rem)] w-full grid-cols-1 items-center gap-8 lg:grid-cols-3">
        {/* Content */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start space-y-6"
        >
          <motion.h1
            variants={fadeInUp}
            className="font-title text-text max-w-2xl text-5xl leading-[1.05] font-bold tracking-tight lg:text-7xl"
          >
            Os melhores <span className="text-marca">COMÉRCIOS</span> &{" "}
            <span className="text-marca">SERVIÇOS</span>
            <br />
            da sua região.
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-text/70 max-w-xl text-base leading-relaxed sm:text-lg"
          >
            Descubra empresas, comércios e serviços do Espírito Santo em um só
            lugar. Encontre negócios, conheça seus serviços e entre em contato
            de forma rápida e fácil.
          </motion.p>

          {/* Search */}
          <SearchInput />
        </motion.div>

        {/* Featured companies carousel */}
        <motion.div
          variants={fadeInRight}
          initial="hidden"
          animate="visible"
          className="relative w-full lg:col-span-2"
        >
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 4500,
                stopOnInteraction: false,
              }),
            ]}
            className="group w-full"
          >
            <CarouselContent>
              {companies.slice(0, 5).map((empresa, index) => (
                <CarouselItem key={index}>
                  <Link
                    href={`/empresas/${empresa.slug}`}
                    className="group/card block"
                  >
                    <div className="relative aspect-4/5 w-full overflow-hidden rounded-4xl xl:aspect-video">
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
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 group-hover/card:scale-105"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 via-black/25 to-transparent p-6 pt-28">
                        <div className="mb-2 flex gap-2">
                          <span className="bg-marca/50 text-text2 inline-flex rounded-full px-3 py-1 text-xs font-medium backdrop-blur-md">
                            Em destaque
                          </span>
                          <span className="text-text2 inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md">
                            {empresa.category?.name}
                          </span>
                        </div>

                        <h2 className="text-2xl font-bold text-white">
                          {empresa.name}
                        </h2>

                        <div className="mt-3 flex items-center gap-2 text-sm font-medium text-white/80">
                          Conhecer empresa
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/card:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Previous */}
            <CarouselPrevious className="hover:text-text left-4 border-white/30 bg-black/20 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-white" />

            {/* Next */}
            <CarouselNext className="hover:text-text right-4 border-white/30 bg-black/20 text-white opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 group-hover:opacity-100 hover:bg-white" />
          </Carousel>

          {/* Decorative element */}
          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{
              delay: 0.9,
            }}
            className="bg-marca3 text-text2 absolute right-6 -bottom-6 z-20 flex h-28 w-28 flex-col items-center justify-center rounded-full shadow-xl transition-transform duration-300 select-none hover:scale-105"
          >
            <span className="font-title text-2xl leading-none font-bold tracking-tight">
              {companies.length || 0}
            </span>

            <span className="font-title mt-1 max-w-17 text-center text-[10px] leading-[1.15] font-semibold tracking-wide uppercase">
              Negócios locais
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
  ArrowUpRight,
  Building2,
  Camera,
  Mail,
  MapPin,
  Phone,
  Road,
  ChevronLeft,
  ChevronRight,
  X,
  Globe,
} from "lucide-react";

import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

import Container from "@/components/Container";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { notFound, useParams } from "next/navigation";
import { useAuth } from "@/hook/useAuth";
import { ApplicationContext } from "@/context/ApplicationContext";
import Loading from "./loading";
import { track } from "@vercel/analytics";

const diasSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const contatoConfig = {
  WHATSAPP: {
    label: "WhatsApp",
    icon: FaWhatsapp,
  },
  PHONE: {
    label: "Telefone",
    icon: Phone,
  },
  EMAIL: {
    label: "E-mail",
    icon: Mail,
  },
  FACEBOOK: {
    label: "Facebook",
    icon: FaFacebook,
  },
  INSTAGRAM: {
    label: "Instagram",
    icon: FaInstagram,
  },
  WEBSITE: {
    label: "Site",
    icon: Globe,
  },
} as const;

export default function EmpresaPage() {
  const { companies, loading } = useAuth(ApplicationContext);
  const { slug } = useParams();

  const EMPRESA = companies.find((empresa) => empresa.slug === slug);

  const [imagemSelecionada, setImagemSelecionada] = useState<number | null>(
    null,
  );

  const imagens = EMPRESA?.images ?? [];

  useEffect(() => {
    if (imagemSelecionada === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setImagemSelecionada(null);
      }

      if (event.key === "ArrowRight") {
        setImagemSelecionada((atual) =>
          atual === null ? null : (atual + 1) % imagens.length,
        );
      }

      if (event.key === "ArrowLeft") {
        setImagemSelecionada((atual) =>
          atual === null ? null : (atual - 1 + imagens.length) % imagens.length,
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [imagemSelecionada, imagens.length]);

  if (loading) {
    return <Loading />;
  }

  if (!EMPRESA) {
    notFound();
  }

  const endereco = EMPRESA.address;

  const enderecoCompleto =
    `${endereco.street}, ${endereco.number}, ` +
    `${endereco.neighborhood}, ${endereco.city} - ${endereco.state}`;

  const linkMapa =
    `https://www.google.com/maps/search/?api=1&query=` +
    encodeURIComponent(enderecoCompleto);

  const linkMapaEmbed = `https://maps.google.com/maps?q=${encodeURIComponent(
    enderecoCompleto,
  )}&output=embed`;

  const whatsapp = EMPRESA.contacts?.find(
    (contato) => contato.type === "WHATSAPP",
  );

  function abrirContato(type: string, value: string) {
    if (type === "EMAIL") {
      return `mailto:${value}`;
    }

    if (type === "WHATSAPP") {
      return value;
    }

    return value;
  }

  return (
    <Container>
      <main className="px-2 py-8 lg:px-6">
        {/* Breadcrumb */}
        <div className="pb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/catalogo"
                  className="text-text/55 hover:text-marca transition-colors"
                >
                  Catálogo
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbLink
                  href={`/catalogo?categoria=${encodeURIComponent(EMPRESA.category!.slug)}`}
                  className="text-text/55 hover:text-marca transition-colors"
                >
                  {EMPRESA.category?.name}
                </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage className="text-text font-semibold">
                  {EMPRESA.name}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Galeria */}
        <section className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr]">
          <GalleryPhoto
            url={imagens[0]?.url}
            name={EMPRESA.name}
            main
            onClick={() => setImagemSelecionada(0)}
          />

          <div className="grid grid-cols-2 gap-3">
            {imagens.slice(1, 5).map((foto, index) => (
              <GalleryPhoto
                key={foto.url}
                url={foto.url}
                name={EMPRESA.name}
                number={index + 2}
                onClick={() => setImagemSelecionada(index + 1)}
              />
            ))}
          </div>
        </section>

        {/* Conteúdo principal e barra lateral */}
        <section className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            {/* Cabeçalho da empresa */}
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    EMPRESA.isActive
                      ? "bg-marca2/10 text-marca2"
                      : "bg-text/10 text-text/60"
                  }`}
                >
                  {EMPRESA.isActive ? "Empresa ativa" : "Inativa"}
                </span>
              </div>

              <h1 className="font-title text-text text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                {EMPRESA.name}
              </h1>

              <div className="text-text/65 mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
                <span className="flex items-center gap-1.5">
                  <Building2 className="text-marca h-4 w-4" />
                  {EMPRESA.category?.name}
                </span>

                <span className="text-text/25 hidden sm:inline">/</span>

                <span className="flex items-center gap-1.5">
                  <MapPin className="text-marca h-4 w-4" />
                  {endereco.city}, {endereco.state}
                </span>
              </div>

              {/* Ações */}
              <div className="mt-7 flex flex-wrap gap-3">
                {whatsapp && (
                  <a
                    href={whatsapp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      track("Contato empresa", {
                        empresa: EMPRESA?.slug,
                      })
                    }
                    className="group bg-marca1 text-text2 hover:bg-marca inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5"
                  >
                    <FaWhatsapp className="h-4 w-4" />
                    Chamar no WhatsApp
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}

                <a
                  href={linkMapa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-marca2/25 text-text hover:bg-marca2/10 inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 text-sm font-semibold transition-colors"
                >
                  <Road className="text-marca2 h-4 w-4" />
                  Como chegar
                </a>
              </div>
            </div>

            {/* Conteúdo da aba */}
            <div className="pt-8">
              <div className="space-y-8">
                <div>
                  <h2 className="font-title text-text text-2xl font-bold">
                    Sobre a empresa
                  </h2>

                  <p className="text-text/70 mt-4 text-base leading-8">
                    {EMPRESA.description}
                  </p>
                </div>

                <div>
                  <h2 className="font-title text-text text-2xl font-bold">
                    Localização
                  </h2>

                  <div className="border-border/50 bg-card mt-4 flex flex-col items-start gap-3 rounded-2xl border p-4">
                    <div className="bg-marca2/10 text-marca2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
                      <MapPin className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-text font-semibold">
                        {endereco.street}, Nº {endereco.number}
                      </p>

                      <p className="text-text/60 mt-1 text-sm leading-6">
                        {endereco.neighborhood}, {endereco.city} -{" "}
                        {endereco.state}
                      </p>

                      <p className="text-text/50 mt-1 text-sm">
                        CEP: {endereco.zipCode}
                      </p>
                    </div>
                    {/* Minimapa dinâmico */}

                    <div className="flex w-full">
                      <div className="aspect-4/3 flex-1 overflow-hidden rounded-xl">
                        <iframe
                          src={linkMapaEmbed}
                          title={`Localização de ${EMPRESA.name}`}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra lateral */}
          <aside className="space-y-4 lg:sticky lg:top-6">
            {/* Contatos */}
            <div className="border-text/10 bg-card rounded-2xl border p-4">
              <h2 className="font-title text-text text-xl font-bold">
                Contato
              </h2>

              <div className="divide-text/10 mt-4 divide-y">
                {EMPRESA.contacts?.map((contato) => {
                  const config =
                    contatoConfig[contato.type as keyof typeof contatoConfig];

                  if (!config) return null;

                  const Icon = config.icon;

                  return (
                    <a
                      key={contato.type}
                      href={abrirContato(contato.type, contato.url)}
                      target={contato.type === "EMAIL" ? undefined : "_blank"}
                      rel={
                        contato.type === "EMAIL"
                          ? undefined
                          : "noopener noreferrer"
                      }
                      className="group flex min-w-0 items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
                    >
                      <div className="bg-marca1/20 text-marca group-hover:bg-marca1/40 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors">
                        <Icon className="h-4 w-4" />
                      </div>

                      <p className="text-text group-hover:text-marca mt-0.5 truncate text-sm font-semibold transition-colors">
                        {config.label}
                      </p>

                      <ArrowUpRight className="text-text/30 group-hover:text-marca h-4 w-4 shrink-0 transition-colors" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Horários */}
            <div className="border-text/10 bg-card rounded-2xl border p-4">
              <div className="flex items-center gap-2">
                <h2 className="font-title text-text text-xl font-bold">
                  Horários
                </h2>
              </div>

              <div className="mt-4 space-y-1">
                {EMPRESA.hours?.map((dia) => {
                  const fechado = !dia.openTime || !dia.closeTime;

                  return (
                    <div
                      key={dia.dayOfWeek}
                      className="even:bg-fundo flex items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-sm"
                    >
                      <span className="text-text/70">
                        {diasSemana[dia.dayOfWeek]}
                      </span>

                      <span
                        className={`shrink-0 font-semibold ${
                          fechado ? "text-text/50" : "text-text"
                        }`}
                      >
                        {fechado
                          ? "Fechado"
                          : `${dia.openTime!.slice(0, 5)} – ${dia.closeTime!.slice(0, 5)}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>
        </section>
      </main>
      {/* Modal da galeria */}
      {imagemSelecionada !== null && imagens[imagemSelecionada]?.url && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-3 backdrop-blur-sm sm:p-6"
          onClick={() => setImagemSelecionada(null)}
        >
          {/* Fechar */}
          <button
            type="button"
            onClick={() => setImagemSelecionada(null)}
            aria-label="Fechar galeria"
            className="absolute top-4 right-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:top-6 sm:right-6"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Imagem ampliada */}
          <div
            className="relative flex h-full max-h-[85vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              key={imagens[imagemSelecionada].url}
              src={imagens[imagemSelecionada].url}
              alt={`${EMPRESA.name} - foto ${imagemSelecionada + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />

            {/* Voltar */}
            {imagens.length > 1 && (
              <button
                type="button"
                aria-label="Imagem anterior"
                onClick={() =>
                  setImagemSelecionada(
                    (imagemSelecionada - 1 + imagens.length) % imagens.length,
                  )
                }
                className="absolute left-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:-left-5 sm:h-12 sm:w-12"
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
            )}

            {/* Avançar */}
            {imagens.length > 1 && (
              <button
                type="button"
                aria-label="Próxima imagem"
                onClick={() =>
                  setImagemSelecionada((imagemSelecionada + 1) % imagens.length)
                }
                className="absolute right-0 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/25 sm:-right-5 sm:h-12 sm:w-12"
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            )}
          </div>

          {/* Contador */}
          <div className="absolute right-0 bottom-5 left-0 text-center">
            <p className="text-sm font-medium text-white/80">
              {imagemSelecionada + 1} de {imagens.length} fotos
            </p>
            <p className="mt-1 text-xs text-white/45">{EMPRESA.name}</p>
          </div>
        </div>
      )}
    </Container>
  );
}

function GalleryPhoto({
  url,
  name,
  main = false,
  number,
  onClick,
}: {
  url?: string;
  name: string;
  main?: boolean;
  number?: number;
  onClick: () => void;
}) {
  const validUrl =
    !!url &&
    (url.startsWith("/") ||
      url.startsWith("https://") ||
      url.startsWith("http://"));

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!validUrl}
      aria-label={`Ampliar ${main ? "foto principal" : `foto ${number}`} de ${name}`}
      className={`group bg-marca1/20 relative block w-full overflow-hidden rounded-2xl text-left ${
        main
          ? "min-h-[260px] md:min-h-[430px]"
          : "min-h-[125px] md:min-h-[208px]"
      } ${validUrl ? "cursor-pointer" : "cursor-default"}`}
    >
      {validUrl ? (
        <Image
          src={url}
          alt={`${name} - foto ${number ?? "principal"}`}
          fill
          sizes={
            main
              ? "(max-width: 768px) 100vw, 60vw"
              : "(max-width: 768px) 50vw, 25vw"
          }
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="from-marca1/20 to-marca1/40 text-marca2 absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br">
          <Camera className={main ? "h-10 w-10" : "h-6 w-6"} />
          <span className="text-xs font-medium">
            {main ? "Foto principal" : `Foto ${number ?? ""}`}
          </span>
        </div>
      )}

      {number === 5 && (
        <div className="bg-fundo2/65 text-text2 absolute inset-0 flex items-center justify-center text-center text-sm font-semibold">
          Ver todas as fotos
        </div>
      )}
    </button>
  );
}

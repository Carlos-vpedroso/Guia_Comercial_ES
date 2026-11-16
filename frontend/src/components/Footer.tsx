"use cache";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";

import Container from "@/components/Container";
import {
  EMAIL,
  FACEBOOK_LINK,
  FORMATED_PHONE_NUMBER,
  INSTAGRAM_LINK,
  WHATSAPP_LINK,
} from "@/config";

const navigation = [
  { label: "Início", href: "/" },
  { label: "Empresas", href: "/catalogo" },
  { label: "Quero anunciar", href: WHATSAPP_LINK },
];

const legalLinks = [
  { label: "Privacidade", href: "/" },
  { label: "Termos de uso", href: "/" },
  { label: "Informações Emergenciais", href: "/" },
];

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-fundo2 text-text2 px-2 py-8 lg:px-6 lg:py-16">
      <Container minHeight={false}>
        {/* Top */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="group inline-flex items-center gap-3"
              aria-label="Guia Comercial ES - Página inicial"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3">
                <Image
                  src="/Logo_G.png"
                  alt="Guia Comercial ES"
                  width={500}
                  height={500}
                  priority
                  className="h-18 w-auto object-contain"
                />
              </div>

              <div className="flex flex-col">
                <span className="font-title text-xl leading-none font-extrabold">
                  Guia Comercial
                </span>
                <span className="text-text2/50 mt-1 text-xs font-medium tracking-[0.2em] uppercase">
                  Espírito Santo
                </span>
              </div>
            </Link>

            <p className="text-text2/60 mt-6 text-sm leading-relaxed">
              Encontre empresas, serviços e comércios perto de você. Conectamos
              pessoas aos negócios que fazem a economia local acontecer.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link
                href={WHATSAPP_LINK}
                aria-label="Facebook"
                className="bg-text2/10 text-text2 hover:bg-marca flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1"
              >
                <FaWhatsapp className="h-4 w-4" />
              </Link>
              <Link
                href={INSTAGRAM_LINK}
                aria-label="Instagram"
                className="bg-text2/10 text-text2 hover:bg-marca flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1"
              >
                <FaInstagram className="h-4 w-4" />
              </Link>

              <Link
                href={FACEBOOK_LINK}
                aria-label="Facebook"
                className="bg-text2/10 text-text2 hover:bg-marca flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:-translate-y-1"
              >
                <FaFacebook className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="font-title text-sm font-bold tracking-wide uppercase">
              Explorar
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {navigation.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-text2/55 hover:text-marca group flex w-fit items-center gap-1.5 text-sm transition-colors"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Para empresas */}
          <div>
            <h3 className="font-title text-sm font-bold tracking-wide uppercase">
              Informações
            </h3>

            <nav className="mt-5 flex flex-col gap-3">
              {legalLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="text-text2/55 hover:text-marca group flex w-fit items-center gap-1.5 text-sm transition-colors"
                >
                  {item.label}
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-title text-sm font-bold tracking-wide uppercase">
              Fale conosco
            </h3>

            <div className="mt-5 flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-text2/10 text-marca flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Mail className="h-4 w-4" />
                </div>

                <div>
                  <span className="text-text2/40 block text-xs">E-mail</span>
                  <span className="text-text2/80 text-sm">{EMAIL}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-text2/10 text-marca flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <Phone className="h-4 w-4" />
                </div>

                <div>
                  <span className="text-text2/40 block text-xs">
                    Atendimento
                  </span>
                  <span className="text-text2/80 text-sm">
                    {FORMATED_PHONE_NUMBER}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-text2/10 text-marca flex h-9 w-9 shrink-0 items-center justify-center rounded-xl">
                  <MapPin className="h-4 w-4" />
                </div>

                <div>
                  <span className="text-text2/40 block text-xs">Região</span>
                  <span className="text-text2/80 text-sm">Espírito Santo</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-4 pt-6 text-xs lg:flex-row lg:justify-between">
          <p className="text-text2/40">
            © {currentYear} Guia Comercial ES. Todos os direitos reservados.
          </p>

          <Link href="https://www.teczed.com" target="_blank">
            <img
              src="/TecZed_Triangle+TECZED.svg"
              alt="TecZed Solutions"
              width={48}
              height={48}
            />
          </Link>
        </div>
      </Container>
    </footer>
  );
}

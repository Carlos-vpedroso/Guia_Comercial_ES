import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/Container";
import ButtonLink from "@/components/ButtonLink";

const stats = [
  {
    value: "3.850",
    label: "pessoas visitaram hoje",
    featured: true,
  },
  {
    value: "12.480",
    label: "visitas no último mês",
    featured: false,
  },
  {
    value: "2.340",
    label: "contatos feitos com empresas no mês",
    featured: false,
  },
];

export default function InfoCta() {
  return (
    <section id="info" className="px-2 py-8 lg:px-6">
      <Container minHeight={false}>
        {/* Estatísticas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={
                stat.featured
                  ? "bg-marca2 text-text2 flex min-h-44 flex-col justify-center gap-2 rounded-3xl p-8 shadow-sm"
                  : "bg-card text-text flex min-h-44 flex-col justify-center gap-2 rounded-3xl p-8 shadow-sm"
              }
            >
              <span className="font-title text-5xl leading-none font-extrabold tracking-tight md:text-6xl">
                {stat.value}
              </span>

              <span
                className={
                  stat.featured
                    ? "font-text text-text2/80 text-base"
                    : "font-text text-text/60 text-base"
                }
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="bg-marca mt-4 grid grid-cols-1 items-center gap-10 rounded-3xl p-8 md:p-12 lg:grid-cols-[1.3fr_1fr] lg:p-16">
          <h2 className="font-title text-text2 text-5xl leading-[0.98] font-extrabold tracking-tight md:text-6xl">
            Tem um negócio?
            <br />
            Bota ele na vitrine.
          </h2>

          <div className="flex flex-col gap-6">
            <p className="font-text text-text2/80 text-base leading-relaxed lg:text-lg">
              Cadastro em poucos minutos. Fotos, horários, WhatsApp e endereço
              em uma página só sua.
            </p>

            <div className="flex">
              <ButtonLink
                href="https://wa.me/5527981939000"
                target
                colorText="text-text"
                bgColor="bg-fundo"
                bgHover=""
              >
                Entrar em contato
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

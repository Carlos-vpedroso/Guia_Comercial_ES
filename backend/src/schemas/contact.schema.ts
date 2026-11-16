import { ContactType } from "@prisma/client";
import { z } from "zod";
import { parseBrazilianPhone } from "../utils/phone.js";
import { isFromDomain, parseWebUrl } from "../utils/url.js";

// telefone com DDD; devolve só os dígitos, sem o 55
function phoneField(message: string, { mobileOnly = false } = {}) {
  return z.string({ error: message }).transform((value, ctx) => {
    const phone = parseBrazilianPhone(value);
    if (!phone || (mobileOnly && !phone.isMobile)) {
      ctx.addIssue({ code: "custom", message });
      return z.NEVER;
    }
    return phone.number;
  });
}

// link http(s) seguro; com `domains`, só desses sites, sempre https e com um perfil depois do domínio
function webUrlField(message: string, domains?: string[]) {
  return z
    .string({ error: message })
    .trim()
    .transform((value, ctx) => {
      const url = parseWebUrl(value);
      const isProfile =
        !domains || (url && isFromDomain(url, domains) && url.pathname !== "/");

      if (!url || !isProfile) {
        ctx.addIssue({ code: "custom", message });
        return z.NEVER;
      }
      if (domains) url.protocol = "https:";
      return url.toString();
    });
}

function socialProfileField(network: string, domains: string[]) {
  return webUrlField(
    `Informe o link do perfil no ${network}, ex.: https://${domains[0]}/suaempresa`,
    domains,
  );
}

const contactSchema = z.discriminatedUnion(
  "type",
  [
    z.object({
      type: z.literal(ContactType.PHONE),
      url: phoneField(
        "Telefone inválido. Use (27) 3200-0000 ou (27) 9 9801-0101",
      ).transform((number) => `tel:+55${number}`),
    }),
    z.object({
      type: z.literal(ContactType.WHATSAPP),
      url: phoneField("O WhatsApp deve ser um celular, ex.: (27) 9 9801-0101", {
        mobileOnly: true,
      }).transform((number) => `https://wa.me/55${number}`),
    }),
    z.object({
      type: z.literal(ContactType.EMAIL),
      url: z
        .string({ error: "E-mail inválido" })
        .trim()
        .toLowerCase()
        .transform((value) => value.replace(/^mailto:/, ""))
        .pipe(z.email("E-mail inválido"))
        .transform((email) => `mailto:${email}`),
    }),
    z.object({
      type: z.literal(ContactType.WEBSITE),
      url: webUrlField(
        "Endereço do site inválido, ex.: https://suaempresa.com.br",
      ),
    }),
    z.object({
      type: z.literal(ContactType.INSTAGRAM),
      url: socialProfileField("Instagram", ["instagram.com"]),
    }),
    z.object({
      type: z.literal(ContactType.FACEBOOK),
      url: socialProfileField("Facebook", ["facebook.com", "fb.com"]),
    }),
    z.object({
      type: z.literal(ContactType.TIKTOK),
      url: socialProfileField("TikTok", ["tiktok.com"]),
    }),
  ],
  { error: "Tipo de contato inválido" },
);

// só chegam os contatos preenchidos, no máximo um de cada tipo
export const contactsSchema = z
  .array(contactSchema, { error: "Contatos inválidos" })
  .refine(
    (contacts) =>
      new Set(contacts.map((contact) => contact.type)).size === contacts.length,
    "Cada tipo de contato só pode aparecer uma vez",
  )
  .default([]);

export type Contacts = z.infer<typeof contactsSchema>;

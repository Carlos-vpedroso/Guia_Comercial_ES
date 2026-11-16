import { z } from "zod";
import { onlyDigits } from "../utils/format.js";

// Salvo como JSON (ex.: companies.address). Campos opcionais vazios ("") não são salvos.
export const addressSchema = z.object(
  {
    street: z
      .string({ error: "A rua é obrigatória" })
      .trim()
      .min(1, "A rua é obrigatória")
      .max(120, "A rua pode ter no máximo 120 caracteres"),
    number: z
      .string({ error: "O número deve ser um texto" })
      .trim()
      .max(10, "O número pode ter no máximo 10 caracteres")
      .transform((number) => number || undefined),
    complement: z
      .string({ error: "O complemento deve ser um texto" })
      .trim()
      .max(60, "O complemento pode ter no máximo 60 caracteres")
      .optional()
      .transform((complement) => complement || undefined),
    neighborhood: z
      .string({ error: "O bairro é obrigatório" })
      .trim()
      .min(1, "O bairro é obrigatório")
      .max(80, "O bairro pode ter no máximo 80 caracteres"),
    city: z
      .string({ error: "A cidade é obrigatória" })
      .trim()
      .min(1, "A cidade é obrigatória")
      .max(80, "A cidade pode ter no máximo 80 caracteres"),
    state: z
      .string({ error: "O estado é obrigatório" })
      .trim()
      .toUpperCase()
      .length(2, "Use a sigla do estado, ex.: ES"),
    zipCode: z
      .string({ error: "O CEP deve ser um texto" })
      .optional()
      .transform((zipCode) => (zipCode ? onlyDigits(zipCode) : undefined))
      .refine(
        (zipCode) => !zipCode || zipCode.length === 8,
        "O CEP deve ter 8 dígitos",
      ),
  },
  { error: "O endereço é obrigatório" },
);

export type Address = z.infer<typeof addressSchema>;

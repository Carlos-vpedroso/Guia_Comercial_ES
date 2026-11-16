import { z } from "zod";
import { addressSchema } from "./address.schema.js";
import { contactsSchema } from "./contact.schema.js";
import { hoursSchema } from "./hours.schema.js";

export const createCompanySchema = z.object({
  name: z
    .string({ error: "O nome é obrigatório" })
    .trim()
    .min(2, "O nome precisa ter pelo menos 2 caracteres")
    .max(100, "O nome pode ter no máximo 100 caracteres"),
  description: z
    .string({ error: "A descrição é obrigatória" })
    .trim()
    .min(1, "A descrição é obrigatória")
    .max(1000, "A descrição pode ter no máximo 1000 caracteres"),
  address: addressSchema,
  isHighlighted: z
    .boolean({ error: "Destaque deve ser verdadeiro ou falso" })
    .default(false),
  isActive: z
    .boolean({ error: "Ativo deve ser verdadeiro ou falso" })
    .default(true),
  categoryId: z.coerce
    .number({ error: "Selecione uma categoria" })
    .int("Selecione uma categoria")
    .min(1, "Selecione uma categoria"),
  hours: hoursSchema,
  contacts: contactsSchema,
});

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;

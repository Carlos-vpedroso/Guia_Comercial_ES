import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string({ error: "O nome é obrigatório" })
    .trim()
    .min(2, "O nome precisa ter pelo menos 2 caracteres")
    .max(100, "O nome pode ter no máximo 100 caracteres"),
  email: z
    .string({ error: "O e-mail é obrigatório" })
    .trim()
    .toLowerCase()
    .max(254, "E-mail inválido")
    .pipe(z.email("E-mail inválido")),
  password: z
    .string({ error: "A senha é obrigatória" })
    .min(12, "A senha precisa ter pelo menos 12 caracteres"),
});

export const loginSchema = z.object({
  email: z
    .string({ error: "O e-mail é obrigatório" })
    .trim()
    .toLowerCase()
    .pipe(z.email("E-mail inválido")),
  password: z
    .string({ error: "A senha é obrigatória" })
    .min(1, "A senha é obrigatória"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

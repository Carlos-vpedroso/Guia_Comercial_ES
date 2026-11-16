import { z } from "zod";

const TIME_FORMAT = /^([01]\d|2[0-3]):[0-5]\d$/;

// "" ou ausente = dia fechado (vira null)
const timeSchema = z
  .string({ error: "Horário inválido" })
  .trim()
  .refine(
    (time) => time === "" || TIME_FORMAT.test(time),
    "Use o formato HH:mm, ex.: 08:00",
  )
  .nullish()
  .transform((time) => time || null);

// fechamento antes da abertura (ex.: 18:00 às 02:00) = passa da meia-noite
const dayHoursSchema = z
  .object({
    dayOfWeek: z
      .number({ error: "Dia da semana inválido" })
      .int("Dia da semana inválido")
      .min(0, "Dia da semana inválido")
      .max(6, "Dia da semana inválido"), // 0 = domingo ... 6 = sábado
    openTime: timeSchema,
    closeTime: timeSchema,
  })
  .superRefine(({ openTime, closeTime }, ctx) => {
    if (!openTime !== !closeTime) {
      ctx.addIssue({
        code: "custom",
        message:
          "Informe abertura e fechamento, ou deixe os dois vazios para fechado",
        path: [openTime ? "closeTime" : "openTime"],
      });
    } else if (openTime && openTime === closeTime) {
      ctx.addIssue({
        code: "custom",
        message: "Abertura e fechamento não podem ser iguais",
        path: ["closeTime"],
      });
    }
  });

// sempre os 7 dias, cada um uma vez
export const hoursSchema = z
  .array(dayHoursSchema, { error: "Informe os horários de funcionamento" })
  .length(7, "Informe os horários dos 7 dias da semana")
  .refine(
    (hours) => new Set(hours.map((day) => day.dayOfWeek)).size === hours.length,
    "Cada dia da semana deve aparecer uma única vez",
  );

export type Hours = z.infer<typeof hoursSchema>;

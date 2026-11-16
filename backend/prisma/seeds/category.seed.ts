import prisma from "../../src/lib/prisma.js";
import { slugify } from "../../src/utils/format.js";

export const CATEGORIES = [
  "Alimentação",
  "Saúde e bem-estar",
  "Beleza",
  "Serviços automotivos",
  "Varejo e moda",
  "Casa e construção",
  "Educação",
  "Serviços profissionais",
  "Pets",
  "Turismo e hospedagem",
] as const;

export type CategoryName = (typeof CATEGORIES)[number];

export async function seedCategories() {
  for (const name of CATEGORIES) {
    const slug = slugify(name);

    await prisma.category.upsert({
      where: { name },
      update: { slug },
      create: { name, slug },
    });
  }

  console.log(`✔ ${CATEGORIES.length} categorias`);
}

import "dotenv/config";
import prisma from "../../src/lib/prisma.js";
import { seedCategories } from "./category.seed.js";
import { seedCompanies } from "./company.seed.js";

async function main() {
  await seedCategories();

  if (process.env.NODE_ENV !== "production") {
    await seedCompanies();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());

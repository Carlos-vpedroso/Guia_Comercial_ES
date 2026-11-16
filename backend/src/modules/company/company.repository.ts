import type { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma.js";

const companyRepository = {
  getAll(options: { isNotActive?: boolean }) {
    return prisma.company.findMany({
      where: options.isNotActive ? {} : { isActive: true },
      orderBy: [{ isHighlighted: "desc" }, { name: "asc" }],
      include: {
        category: true,
        contacts: true,
        images: {
          orderBy: [{ isCover: "desc" }, { createdAt: "asc" }],
        },
        hours: {
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });
  },

  getCompanyBySlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
      include: {
        category: true,
        contacts: true,
        images: true,
        hours: true,
      },
    });
  },

  create(data: Prisma.CompanyUncheckedCreateInput) {
    return prisma.company.create({
      data,
      include: {
        category: true,
        contacts: true,
        images: true,
        hours: true,
      },
    });
  },

  update(id: string, data: Prisma.CompanyUncheckedUpdateInput) {
    return prisma.company.update({
      where: { id },
      data,
      include: {
        category: true,
        contacts: true,
        images: true,
        hours: true,
      },
    });
  },

  delete(id: string) {
    return prisma.company.delete({ where: { id } });
  },

  async existsBySlug(slug: string) {
    return prisma.company.count({ where: { slug } }).then((count) => count > 0);
  },
};

export default companyRepository;

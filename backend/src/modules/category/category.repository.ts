import prisma from "../../lib/prisma.js";

const categoryRepository = {
  async getAllWithCount() {
    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { companies: { where: { isActive: true } } } },
      },
    });

    return categories.map(({ _count, ...category }) => ({
      ...category,
      companiesCount: _count.companies,
    }));
  },

  getById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  },

  getBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },

  // só empresas ativas, destaques primeiro, com os campos que o card da listagem usa
  getBySlugWithCompanies(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        companies: {
          where: { isActive: true },
          orderBy: [{ isHighlighted: "desc" }, { name: "asc" }],
          select: {
            name: true,
            address: true,
            isHighlighted: true,
            images: {
              where: { isCover: true },
              select: { url: true },
              take: 1,
            },
          },
        },
      },
    });
  },
};

export default categoryRepository;

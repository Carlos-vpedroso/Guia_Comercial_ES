import prisma from "../../lib/prisma.js";
import { RegisterInput } from "../../schemas/auth.schema.js";

const adminRepository = {
  getByEmail(email: string) {
    return prisma.admin.findUnique({ where: { email } });
  },

  getById(id: string) {
    return prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  },

  create(data: RegisterInput) {
    return prisma.admin.create({
      data,
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  },
};

export default adminRepository;

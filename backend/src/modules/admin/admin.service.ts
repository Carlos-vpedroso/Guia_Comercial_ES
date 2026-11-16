import bcrypt from "bcrypt";
import AppError from "../../lib/errors.js";
import { signToken } from "../../lib/jwt.js";
import type { LoginInput, RegisterInput } from "../../schemas/auth.schema.js";
import adminRepository from "./admin.repository.js";

const adminService = {
  async register({ password, ...admin }: RegisterInput) {
    const hashedPassword = await bcrypt.hash(password, 12);
    return adminRepository.create({ ...admin, password: hashedPassword });
  },

  async login({ email, password }: LoginInput) {
    const admin = await adminRepository.getByEmail(email);
    if (!admin) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "E-mail ou senha inválidos",
      );
    }

    const isValid = await bcrypt.compare(password, admin?.password);

    if (!isValid) {
      throw new AppError(
        401,
        "INVALID_CREDENTIALS",
        "E-mail ou senha inválidos",
      );
    }

    const token = await signToken(admin.id);
    return {
      token,
      admin: { id: admin.id, name: admin.name, email: admin.email },
    };
  },

  async getAdmin(id: string) {
    const admin = await adminRepository.getById(id);

    if (!admin) {
      throw new AppError(401, "INVALID_TOKEN", "Sessão inválida ou expirada");
    }
    return admin;
  },
};

export default adminService;

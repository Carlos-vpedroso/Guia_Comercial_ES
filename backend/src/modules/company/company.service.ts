import {
  deleteFolder,
  deleteImages,
  uploadImages,
} from "../../lib/cloudinary.js";
import AppError from "../../lib/errors.js";
import { slugify } from "../../utils/format.js";
import categoryRepository from "../category/category.repository.js";
import companyRepository from "./company.repository.js";
import type { CreateCompanyInput } from "../../schemas/company.schema.js";

const companyService = {
  getAll(options: { isNotActive?: boolean }) {
    return companyRepository.getAll(options);
  },

  async getCompanyBySlug(slug: string) {
    const company = await companyRepository.getCompanyBySlug(slug);
    if (!company) {
      throw new AppError(404, "COMPANY_NOT_FOUND", "Empresa não encontrada");
    }
    return company;
  },

  async create(input: CreateCompanyInput, images: Express.Multer.File[]) {
    const category = await categoryRepository.getById(input.categoryId);
    if (!category) {
      throw new AppError(
        400,
        "CATEGORY_NOT_FOUND",
        "A categoria selecionada não existe",
      );
    }

    const slug = slugify(input.name);
    if (await companyRepository.existsBySlug(slug)) {
      throw new AppError(
        409,
        "COMPANY_ALREADY_EXISTS",
        "Já existe uma empresa com esse nome",
      );
    }

    const { hours, contacts, ...company } = input;

    const uploaded = await uploadImages(
      images.map((image) => image.buffer),
      `guiacomerciales/${slug}`,
    );

    try {
      return await companyRepository.create({
        ...company,
        slug,
        hours: { create: hours },
        contacts: { create: contacts },
        images: {
          create: uploaded.map((image, index) => ({
            url: image.secure_url,
            storageKey: image.public_id,
            isCover: index === 0,
          })),
        },
      });
    } catch (error) {
      await deleteFolder(
        `guiacomerciales/${slug}`,
        uploaded.map((image) => image.public_id),
      );
      throw error;
    }
  },

  async update(
    slug: string,
    input: CreateCompanyInput,
    deleteImageIds: string[],
    images: Express.Multer.File[],
  ) {
    const current = await companyRepository.getCompanyBySlug(slug);
    if (!current) {
      throw new AppError(404, "COMPANY_NOT_FOUND", "Empresa não encontrada");
    }

    const category = await categoryRepository.getById(input.categoryId);
    if (!category) {
      throw new AppError(
        400,
        "CATEGORY_NOT_FOUND",
        "A categoria selecionada não existe",
      );
    }

    const newSlug = slugify(input.name);
    if (
      newSlug !== current.slug &&
      (await companyRepository.existsBySlug(newSlug))
    ) {
      throw new AppError(
        409,
        "COMPANY_ALREADY_EXISTS",
        "Já existe uma empresa com esse nome",
      );
    }

    const { hours, contacts, ...company } = input;

    const currentImageIds = current.images.map((image) => image.id);

    if (deleteImageIds.some((id) => !currentImageIds.includes(id))) {
      throw new AppError(
        400,
        "IMAGE_NOT_FOUND",
        "Foto não encontrada nesta empresa",
      );
    }

    const removed = current.images.filter((image) =>
      deleteImageIds.includes(image.id),
    );
    const kept = current.images.filter(
      (image) => !deleteImageIds.includes(image.id),
    );

    const total = kept.length + images.length;
    if (total === 0) {
      throw new AppError(
        400,
        "IMAGES_REQUIRED",
        "A empresa precisa ter pelo menos uma foto",
      );
    }
    if (total > 5) {
      throw new AppError(
        400,
        "TOO_MANY_IMAGES",
        "A empresa pode ter no máximo 5 fotos",
      );
    }

    const uploaded =
      images.length > 0
        ? await uploadImages(
            images.map((image) => image.buffer),
            `guiacomerciales/${current.slug}`,
          )
        : [];

    const hasCover = kept.some((image) => image.isCover);
    const newCoverId = !hasCover && kept.length > 0 ? kept[0].id : undefined;

    let updated;
    try {
      updated = await companyRepository.update(current.id, {
        ...company,
        hours: { deleteMany: {}, create: hours },
        contacts: { deleteMany: {}, create: contacts },
        images: {
          deleteMany: { id: { in: deleteImageIds } },
          update: newCoverId
            ? [{ where: { id: newCoverId }, data: { isCover: true } }]
            : [],
          create: uploaded.map((image, index) => ({
            url: image.secure_url,
            storageKey: image.public_id,
            isCover: !hasCover && kept.length === 0 && index === 0,
          })),
        },
      });
    } catch (error) {
      await deleteImages(uploaded.map((image) => image.public_id));
      throw error;
    }

    await deleteImages(removed.map((image) => image.storageKey));

    return updated;
  },

  async delete(slug: string) {
    const company = await companyRepository.getCompanyBySlug(slug);
    if (!company) {
      throw new AppError(404, "COMPANY_NOT_FOUND", "Empresa não encontrada");
    }

    await companyRepository.delete(company.id);
    await deleteFolder(
      `guiacomerciales/${slug}`,
      company.images.map((image) => image.storageKey),
    );
  },
};

export default companyService;

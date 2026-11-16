import type { Request, Response } from "express";
import AppError from "../../lib/errors.js";
import { createCompanySchema } from "../../schemas/company.schema.js";
import companyService from "./company.service.js";
import z from "zod";

const companyController = {
  async getAll(req: Request, res: Response) {
    const options = req.query;
    const companies = await companyService.getAll(options);

    res.json(companies);
  },

  async getCompanyBySlug(req: Request<{ slug: string }>, res: Response) {
    const company = await companyService.getCompanyBySlug(req.params.slug);

    res.json(company);
  },

  async create(req: Request, res: Response) {
    let body = JSON.parse(req.body?.data);
    const data = createCompanySchema.parse(body);

    const images = Array.isArray(req.files) ? req.files : [];
    if (images.length === 0) {
      throw new AppError(400, "IMAGES_REQUIRED", "Envie pelo menos uma foto");
    }

    const company = await companyService.create(data, images);

    res.status(201).json(company);
  },

  async update(req: Request<{ slug: string }>, res: Response) {
    const body = JSON.parse(req.body?.data);
    const data = createCompanySchema.parse(body);

    const deleteImageIds = z
      .array(z.string(), { error: "Imagens a remover inválidas" })
      .parse(JSON.parse(req.body?.deleteImageIds ?? "[]"));

    const images = Array.isArray(req.files) ? req.files : [];

    const company = await companyService.update(
      req.params.slug,
      data,
      deleteImageIds,
      images,
    );

    res.json(company);
  },

  async delete(req: Request<{ slug: string }>, res: Response) {
    await companyService.delete(req.params.slug);
    res.status(204).send();
  },
};

export default companyController;

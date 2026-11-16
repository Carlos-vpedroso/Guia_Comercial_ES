import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";
import AppError from "./errors.js";

cloudinary.config({ secure: true });

export function uploadImage(file: Buffer, folder: string) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp"],
        },
        (error, result) => {
          if (error || !result) {
            return reject(
              error ?? new Error("Cloudinary não retornou o upload"),
            );
          }
          resolve(result);
        },
      )
      .end(file);
  });
}

export async function deleteImages(publicIds: string[]) {
  if (publicIds.length === 0) return;

  try {
    await cloudinary.api.delete_resources(publicIds, {
      resource_type: "image",
    });
  } catch (error: any) {
    console.error(
      "Falha ao apagar imagens do Cloudinary",
      publicIds,
      error?.error?.message ?? error?.message,
    );
  }
}

export async function deleteFolder(folder: string, publicIds: string[]) {
  await deleteImages(publicIds);

  try {
    await cloudinary.api.delete_folder(folder);
  } catch (error: any) {
    console.error(
      "Falha ao apagar a pasta do Cloudinary",
      folder,
      error?.error?.message ?? error?.message,
    );
  }
}

export async function uploadImages(files: Buffer[], folder: string) {
  const uploads = await Promise.allSettled(
    files.map((file) => uploadImage(file, folder)),
  );
  const uploaded = uploads.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : [],
  );

  if (uploaded.length < files.length) {
    for (const result of uploads) {
      if (result.status === "rejected") {
        console.error("Falha no upload para o Cloudinary", result.reason);
      }
    }
    await deleteFolder(
      folder,
      uploaded.map((image) => image.public_id),
    );
    throw new AppError(
      502,
      "IMAGE_UPLOAD_FAILED",
      "Não foi possível enviar as fotos. Tente novamente",
    );
  }

  return uploaded;
}

import { PromiseError } from "@/types/Error";

export { cn } from "cn";

export const scrollToSection = (id: string) => {
  const element = document.getElementById(id);

  if (!element) return;

  const start = window.scrollY;
  const target = element.getBoundingClientRect().top + window.scrollY;
  const distance = target - start;
  const duration = 1200;

  let startTime: number | null = null;

  const animate = (currentTime: number) => {
    if (startTime === null) {
      startTime = currentTime;
    }

    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // easeInOutCubic
    const eased =
      progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

    window.scrollTo(0, start + distance * eased);

    if (progress < 1) {
      requestAnimationFrame(animate);
    }
  };

  requestAnimationFrame(animate);
};

export function gerarSlug(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function handleResult<T>(
  result: T[] | PromiseError,
  setter: React.Dispatch<React.SetStateAction<T[]>>,
  label: string,
) {
  if ("error" in result) {
    console.error(`Erro ao buscar ${label}:`, result.error.message);
    return;
  }

  setter(result);
}

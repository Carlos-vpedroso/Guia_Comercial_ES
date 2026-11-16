// "Padaria Pão Dourado" -> "padaria-pao-dourado"
export function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// "29100-011" -> "29100011"
export function onlyDigits(text: string) {
  return text.replace(/\D/g, "");
}

import { onlyDigits } from "./format.js";

// DDD (sem zero) + celular (9 + 8 dígitos) ou fixo (começa com 2 a 5, 8 dígitos)
const BRAZILIAN_PHONE = /^([1-9]{2})(9\d{8}|[2-5]\d{7})$/;

// Aceita com ou sem máscara: "(27) 3200-0000", "(27) 9 9801-0101", "+55 27 99801-0101".
// Devolve o número com DDD e sem o 55 (ex.: "27998010101"), ou null se for inválido.
export function parseBrazilianPhone(text: string) {
  const digits = onlyDigits(text);
  const local =
    digits.length > 11 && digits.startsWith("55") ? digits.slice(2) : digits;

  const match = BRAZILIAN_PHONE.exec(local);
  if (!match) return null;

  return { number: local, isMobile: match[2].length === 9 };
}

import { maskCEP, maskPhone } from "@/lib/masks";
import { useCallback } from "react";

export function useMask() {
  const cep = useCallback(maskCEP, []);
  const phone = useCallback(maskPhone, []);

  return { cep, phone };
}

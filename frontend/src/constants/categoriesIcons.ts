import type React from "react";

import {
  ShoppingBag,
  CarFront,
  House,
  Utensils,
  HeartPulse,
  Sparkles,
  BriefcaseBusiness,
  GraduationCap,
  PawPrint,
  Palmtree,
} from "lucide-react";

export const categoriesIcons: Record<string, React.ElementType> = {
  alimentacao: Utensils,
  "saude-e-bem-estar": HeartPulse,
  beleza: Sparkles,
  "servicos-automotivos": CarFront,
  "varejo-e-moda": ShoppingBag,
  "casa-e-construcao": House,
  educacao: GraduationCap,
  "servicos-profissionais": BriefcaseBusiness,
  pets: PawPrint,
  "turismo-e-hospedagem": Palmtree,
};

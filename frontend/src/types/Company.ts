import type { Category } from "./Category";
import type { Contact, ContactType } from "./Contact";
import type { Image } from "./Image";
import type { Hours } from "./Hour";

export type AddressCompany = {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
};

export interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;

  address: AddressCompany;

  isHighlighted: boolean;
  isActive: boolean;

  categoryId: number;
  category?: Category;

  contacts?: Contact[];
  images?: Image[];
  hours?: Hours[];

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCompanyDTO {
  data: {
    name: string;
    description: string;
    address: AddressCompany;
    isHighlighted: boolean;
    isActive: boolean;
    categoryId: number;
    hours: {
      dayOfWeek: number;
      openTime: string | null;
      closeTime: string | null;
    }[];
    contacts: { type: ContactType; url: string }[];
  };
  images: File[];
  deleteImageIds?: string[];
}

export type ContactType =
  | "PHONE"
  | "EMAIL"
  | "WHATSAPP"
  | "FACEBOOK"
  | "INSTAGRAM"
  | "TIKTOK"
  | "WEBSITE";

export interface Contact {
  id: string;
  url: string;
  type: ContactType;

  companyId: string;

  createdAt?: string;
  updatedAt?: string;
}

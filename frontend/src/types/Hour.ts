export interface Hours {
  id: string;
  dayOfWeek: number;
  openTime: string | null;
  closeTime: string | null;

  companyId: string;

  createdAt?: string;
  updatedAt?: string;
}

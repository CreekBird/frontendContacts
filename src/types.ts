// src/types.ts
export interface Contact {
  id?: number | string;
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  status: string;
  photoUrl?: string;
}

export interface PaginatedData {
  content: Contact[];
  totalPages: number;
  totalElements: number;
}

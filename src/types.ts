// src/types.ts
export interface Contact {
  id: string;
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
  number?: number;
  size?: number;
  last?: boolean;
  first?: boolean;
  empty?: boolean;
}

import axios, { AxiosResponse } from 'axios';

const API_URL = 'http://localhost:8080/contacts';

export interface ContactResponseData {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  title?: string;
  status?: string;
  photoUrl?: string;
  content?: ContactResponseData[];
  totalPages?: number;
  totalElements?: number;
  [key: string]: any;
}

export async function saveContact(
  contact: ContactResponseData,
): Promise<AxiosResponse<ContactResponseData>> {
  return axios.post<ContactResponseData>(API_URL, contact);
}

export async function getContacts(
  page: number = 0,
  size: number = 10,
): Promise<
  AxiosResponse<{
    content: ContactResponseData[];
    totalPages: number;
    totalElements: number;
  }>
> {
  return axios.get(`${API_URL}?page=${page}&size=${size}`);
}

export async function getContact(
  id: number,
): Promise<AxiosResponse<ContactResponseData>> {
  return axios.get<ContactResponseData>(`${API_URL}/${id}`);
}

export async function updateContact(
  contact: ContactResponseData,
): Promise<AxiosResponse<ContactResponseData>> {
  return axios.put<ContactResponseData>(`${API_URL}/${contact.id}`, contact);
}

export async function updatePhoto(
  formData: FormData,
): Promise<AxiosResponse<ContactResponseData>> {
  return axios.put<ContactResponseData>(`${API_URL}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export async function deleteContact(id: number): Promise<AxiosResponse<void>> {
  return axios.delete<void>(`${API_URL}/${id}`);
}

import axios from 'axios';

const API_URL = 'http://localhost:8080/contacts';

export interface Contact {
  id?: number | string;
  name: string;
  title: string;
  photoUrl?: string;
  email: string;
  address: string;
  phone: string;
  status: 'Active' | 'Inactive' | string;
}

export async function saveContact(contact: Contact) {
  return await axios.post<Contact>(API_URL, contact);
}

export async function getContacts(page = 0, size = 10) {
  return await axios.get<Contact[]>(`${API_URL}?page=${page}&size=${size}`);
}

export async function getContact(id: number | string) {
  return await axios.get<Contact>(`${API_URL}/${id}`);
}
export async function updateContact(contact: Contact) {
  return await axios.post<Contact>(API_URL, contact);
}

export async function updatePhoto(formData: FormData) {
  return await axios.put(`${API_URL}/photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
// Delete a contact by ID
export async function deleteContact(id: number | string) {
  return await axios.delete(`${API_URL}/${id}`);
}

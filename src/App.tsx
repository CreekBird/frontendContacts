import { useEffect, useRef, useState, ChangeEvent, FormEvent } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import ContactList from './components/ContactList';
import {
  ContactResponseData,
  getContacts,
  saveContact,
  updatePhoto,
} from './api/ContactService';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import ContactDetail from './components/ContactDetail';
import { toastError } from './api/ToastService';
import { ToastContainer } from 'react-toastify';
import Login from './Login/Login';

interface ContactFormValues {
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  status: string;
}

interface ApiResponse {
  content: any[];
  totalPages: number;
  totalElements: number;
  [key: string]: any;
}

function App() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [data, setData] = useState<{
    content: ContactResponseData[];
    totalPages: number;
    totalElements: number;
  }>({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
  });

  const getAllContacts = async (page: number = 0, size: number = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (error) {
      console.error(error);
      toastError(
        error instanceof Error ? error.message : 'Failed to fetch contacts',
      );
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };
  const handleLogin = async (token?: string) => {
    if (token) {
      // Store the token (in state, context, or localStorage)
      localStorage.setItem('authToken', token);

      navigate('/contacts');
    }
  };

  const handleNewContact = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const { data: contactData } = await saveContact(values);

      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        if (contactData.id !== undefined && contactData.id !== null) {
          formData.append('id', contactData.id.toString());
        } else {
          throw new Error('Contact ID is undefined');
        }
        await updatePhoto(formData);
      }

      toggleModal(false);
      setFile(null);
      if (fileRef.current) fileRef.current.value = '';
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      });
      await getAllContacts();
    } catch (error) {
      console.error(error);
      toastError(
        error instanceof Error ? error.message : 'Failed to create contact',
      );
    }
  };

  const updateContact = async (contact: ContactResponseData) => {
    try {
      await saveContact({
        id: contact.id,
        name: contact.name ?? '',
        email: contact.email ?? '',
        phone: contact.phone ?? '',
        address: contact.address ?? '',
        title: contact.title ?? '',
        status: contact.status ?? '',
      });
    } catch (error) {
      console.error(error);
      toastError(
        error instanceof Error ? error.message : 'Failed to update contact',
      );
    }
  };

  const updateImage = async (formData: FormData) => {
    try {
      await updatePhoto(formData);
    } catch (error) {
      console.error(error);
      toastError(
        error instanceof Error ? error.message : 'Failed to update photo',
      );
    }
  };

  const toggleModal = (show: boolean) => {
    if (!modalRef.current) return;
    show ? modalRef.current.showModal() : modalRef.current.close();
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header
        toggleModal={toggleModal}
        nbOfContacts={data.totalElements || 0}
      />

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Login onLogin={handleLogin} />} />
            <Route path="/contacts" element={<Navigate to={'/contacts'} />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={{
                    ...data,
                    content: data.content.filter(
                      (contact) => contact.id !== undefined,
                    ) as any, // Optionally, map id to string if required
                  }}
                  currentPage={currentPage}
                  getAllContacts={getAllContacts}
                />
              }
            />
            <Route
              path="/contacts/:id"
              element={
                <ContactDetail
                  updateContact={updateContact}
                  updateImage={updateImage}
                />
              }
            />
          </Routes>
        </div>
      </main>

      {/* Modal */}
      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i
            onClick={() => toggleModal(false)}
            className="bi bi-x-lg"
            role="button"
            aria-label="Close modal"
          ></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              {Object.keys(values).map((field) => (
                <div className="input-box" key={field}>
                  <span className="details">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </span>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    value={values[field as keyof ContactFormValues]}
                    onChange={onChange}
                    name={field}
                    required
                  />
                </div>
              ))}
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  ref={fileRef}
                  name="photo"
                  accept="image/*"
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                onClick={() => toggleModal(false)}
                type="button"
                className="btn btn-danger"
              >
                Cancel
              </button>
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </dialog>
      <ToastContainer />
    </>
  );
}

export default App;

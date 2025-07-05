import { useEffect, useRef, useState, ChangeEvent, FormEvent } from "react";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import ContactList from "./components/ContactList";
import { getContacts, saveContact, updatePhoto } from "./api/ContactService";
import { Routes, Route, Navigate } from "react-router-dom";
import ContactDetail from "./components/ContactDetail";
import { toastError } from "./api/ToastService";
import { ToastContainer } from "react-toastify";
import { Contact, PaginatedData } from "./types";

function App() {
  const modalRef = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [data, setData] = useState<PaginatedData>({
    content: [],
    totalPages: 0,
    totalElements: 0,
  });

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [values, setValues] = useState<Contact>({
    name: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    status: "",
  });

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data as unknown as PaginatedData);
      console.log(data);
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleNewContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", String(data.id));
      await updatePhoto(formData);

      toggleModal(false);
      setFile(undefined);
      if (fileRef.current) fileRef.current.value = "";
      setValues({
        name: "",
        email: "",
        phone: "",
        address: "",
        title: "",
        status: "",
      });
      getAllContacts();
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const updateContact = async (contact: Contact) => {
    try {
      const { data } = await saveContact(contact);
      console.log(data);
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const updateImage = async (formData: FormData) => {
    try {
      await updatePhoto(formData);
    } catch (error: any) {
      console.error(error);
      toastError(error.message);
    }
  };

  const toggleModal = (show: boolean) => {
    if (modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  };

  useEffect(() => {
    getAllContacts();
  }, []);

  return (
    <>
      <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} />
      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/contacts" />} />
            <Route
              path="/contacts"
              element={
                <ContactList
                  data={data}
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

      <dialog ref={modalRef} className="modal" id="modal">
        <div className="modal__header">
          <h3>New Contact</h3>
          <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
        </div>
        <div className="divider"></div>
        <div className="modal__body">
          <form onSubmit={handleNewContact}>
            <div className="user-details">
              {[
                { name: "name", label: "Name" },
                { name: "email", label: "Email" },
                { name: "title", label: "Title" },
                { name: "phone", label: "Phone Number" },
                { name: "address", label: "Address" },
                { name: "status", label: "Account Status" },
              ].map((field) => (
                <div className="input-box" key={field.name}>
                  <span className="details">{field.label}</span>
                  <input
                    type="text"
                    name={field.name}
                    value={(values as any)[field.name]}
                    onChange={onChange}
                    required
                  />
                </div>
              ))}
              <div className="file-input">
                <span className="details">Profile Photo</span>
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files?.[0])}
                  ref={fileRef}
                  name="photo"
                  required
                />
              </div>
            </div>
            <div className="form_footer">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => toggleModal(false)}
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

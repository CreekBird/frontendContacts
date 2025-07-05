import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  FormEvent,
} from 'react';
import { Link, useParams } from 'react-router-dom';
import { ContactResponseData, getContact } from '../api/ContactService';
import { toastError, toastSuccess } from '../api/ToastService';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  status: string;
  photoUrl: string;
}

interface ContactDetailProps {
  updateContact: (contact: ContactResponseData) => Promise<void>;
  updateImage: (formData: FormData) => Promise<void>;
}

const ContactDetail: React.FC<ContactDetailProps> = ({
  updateContact,
  updateImage,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [contact, setContact] = useState<ContactResponseData>({
    id: 0,
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
    photoUrl: '',
  });

  const { id } = useParams<{ id: string }>();

  const fetchContact = async (id: string) => {
    try {
      const { data } = await getContact(Number(id));

      setContact(data);
      toastSuccess('Contact retrieved');
    } catch (error) {
      console.error(error);
      toastError(
        error instanceof Error ? error.message : 'Failed to fetch contact',
      );
    }
  };

  const selectImage = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const updatePhoto = async (file: File | null) => {
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file, file.name);
      formData.append('id', id!);
      await updateImage(formData);
      setContact((prev) => ({
        ...prev,
        photoUrl: `${prev.photoUrl}?updated_at=${new Date().getTime()}`,
      }));
      toastSuccess('Photo updated');
    } catch (error) {
      console.error(error);
      toastError(
        error instanceof Error ? error.message : 'Photo update failed',
      );
    }
  };

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContact((prev) => ({ ...prev, [name]: value }));
  };

  const onUpdateContact = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await updateContact(contact);
      await fetchContact(id!);
      toastSuccess('Contact Updated');
    } catch (error) {
      console.error(error);
      toastError(error instanceof Error ? error.message : 'Update failed');
    }
  };

  useEffect(() => {
    if (id) {
      fetchContact(id);
    }
  }, [id]);

  return (
    <>
      <Link to={'/contacts'} className="link">
        <i className="bi bi-arrow-left"></i> Back to list
      </Link>

      <div className="profile">
        <div className="profile__details">
          <img
            src={contact.photoUrl || '/default-avatar.png'}
            alt={contact.name ? `${contact.name}` : 'Contact avatar'}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/default-avatar.png';
            }}
          />
          <div className="profile__metadata">
            <p className="profile__name">{contact.name}</p>
            <p className="profile__muted">JPG, GIF, or PNG. Max size of 10MB</p>
            <button onClick={selectImage} className="btn">
              <i className="bi bi-cloud-upload"></i> Change Photo
            </button>
          </div>
        </div>

        <div className="profile__settings">
          <form onSubmit={onUpdateContact} className="form">
            <div className="user-details">
              <input type="hidden" value={contact.id} name="id" />

              {['name', 'email', 'phone', 'address', 'title', 'status'].map(
                (field) => (
                  <div className="input-box" key={field}>
                    <span className="details">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </span>
                    <input
                      type={field === 'email' ? 'email' : 'text'}
                      value={contact[field as keyof Contact]}
                      onChange={onChange}
                      name={field}
                      required
                    />
                  </div>
                ),
              )}
            </div>
            <div className="form_footer">
              <button type="submit" className="btn">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>

      <form style={{ display: 'none' }}>
        <input
          type="file"
          ref={inputRef}
          onChange={(e) => updatePhoto(e.target.files?.[0] || null)}
          name="file"
          accept="image/*"
        />
      </form>
    </>
  );
};

export default ContactDetail;

import React from 'react';
import Contact from './Contact';

interface ContactType {
  id: string | number;
  name: string;
  title: string;
  email: string;
  address: string;
  phone: string;
  status: string;
  photoUrl: string;
}

interface PaginatedResponse {
  content: ContactType[];
  totalPages: number;
  [key: string]: any; // For any additional pagination properties
}

interface ContactListProps {
  data: PaginatedResponse | null;
  currentPage: number;
  getAllContacts: (page: number) => void;
}

const ContactList: React.FC<ContactListProps> = ({
  data,
  currentPage,
  getAllContacts,
}) => {
  const handlePageClick = (page: number) => {
    // Prevent navigation to invalid pages
    if (page < 0 || page >= (data?.totalPages ?? 0)) return;
    getAllContacts(page);
  };

  return (
    <main className="main">
      {data?.content?.length === 0 && (
        <div className="no-contacts">No Contacts. Please add a new contact</div>
      )}

      <ul className="contact__list">
        {data?.content?.map((contact) => (
          <Contact contact={contact} key={contact.id} />
        ))}
      </ul>

      {data?.content && data.content.length > 0 && data.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            disabled={currentPage === 0}
            className={currentPage === 0 ? 'disabled' : ''}
          >
            &laquo;
          </button>

          {Array.from({ length: data.totalPages }, (_, page) => (
            <button
              key={page}
              onClick={() => handlePageClick(page)}
              className={currentPage === page ? 'active' : ''}
            >
              {page + 1}
            </button>
          ))}

          <button
            onClick={() => handlePageClick(currentPage + 1)}
            disabled={currentPage === data.totalPages - 1}
            className={currentPage === data.totalPages - 1 ? 'disabled' : ''}
          >
            &raquo;
          </button>
        </div>
      )}
    </main>
  );
};

export default ContactList;

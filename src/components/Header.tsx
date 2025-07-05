import React from 'react';

interface HeaderProps {
  toggleModal: (show: boolean) => void;
  nbOfContacts: number;
}

const Header: React.FC<HeaderProps> = ({ toggleModal, nbOfContacts }) => {
  return (
    <header className="header">
      <div className="container">
        <h3>Contact List ({nbOfContacts})</h3>
        <button
          onClick={() => toggleModal(true)}
          className="btn"
          aria-label="Add new contact"
        >
          <i className="bi bi-plus-square"></i> Add New Contact
        </button>
      </div>
    </header>
  );
};

export default Header;

import React from "react";
import { Link } from "react-router-dom";

interface ContactProps {
  contact: {
    id?: number | string;
    name: string;
    title: string;
    photoUrl?: string;
    email: string;
    address: string;
    phone: string;
    status: "Active" | "Inactive" | string;
  };
}

const Contact: React.FC<ContactProps> = ({ contact }) => {
  return (
    <Link to={`/contacts/${contact.id}`} className="contact__item">
      <div className="contact__header">
        <div className="contact__image">
          <img src={contact.photoUrl} alt={contact.name} />
        </div>
        <div className="contact__details">
          <p className="contact_name">{contact.name.substring(0, 15)}</p>
          <p className="contact_title">{contact.title}</p>
        </div>
      </div>
      <div className="contact__body">
        <p>
          <i className="bi bi-envelope" aria-hidden="true"></i>{" "}
          {contact.email.substring(0, 20)}
        </p>
        <p>
          <i className="bi bi-geo" aria-hidden="true"></i> {contact.address}
        </p>
        <p>
          <i className="bi bi-telephone" aria-hidden="true"></i> {contact.phone}
        </p>
        <p>
          {contact.status === "Active" ? (
            <i className="bi bi-check-circle text-success"></i>
          ) : (
            <i className="bi bi-x-circle text-danger"></i>
          )}{" "}
          {contact.status}
        </p>
      </div>
    </Link>
  );
};

export default Contact;

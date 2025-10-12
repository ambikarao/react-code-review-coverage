// Contact.tsx
import React, { useState } from "react";

export interface Contact {
  name: string;
  email: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const sendMessage = (contact: Contact): string => {
  if (!validateEmail(contact.email)) {
    return "Invalid email";
  }
  if (!contact.message.trim()) {
    return "Message cannot be empty";
  }
  return `Message sent to ${contact.name}`;
};

const ContactForm: React.FC = () => {
  const [form, setForm] = useState<Contact>({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = sendMessage(form);
    setStatus(result);
    if (result.startsWith("Message sent")) {
      setForm({ name: "", email: "", message: "" });
    }
  };

  return (
    <div>
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Message"
        />
        <button type="submit">Send</button>
      </form>
      <p data-testid="status">{status}</p>
    </div>
  );
};

export default ContactForm;

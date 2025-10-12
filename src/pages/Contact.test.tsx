// Contact.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactForm, { validateEmail, sendMessage } from "./Contact";

describe("validateEmail", () => {
  test("returns true for a valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
    expect(validateEmail("")).toBe(false);
  });
});

describe("sendMessage", () => {
  test("returns 'Invalid email' if email is invalid", () => {
    const contact = { name: "Test", email: "bad-email", message: "Hello" };
    expect(sendMessage(contact)).toBe("Invalid email");
  });

  test("returns 'Message cannot be empty' if message is empty", () => {
    const contact = { name: "Test", email: "test@example.com", message: "" };
    expect(sendMessage(contact)).toBe("Message cannot be empty");
  });

  test("returns sent message text if valid", () => {
    const contact = { name: "Alice", email: "alice@example.com", message: "Hi there" };
    expect(sendMessage(contact)).toBe("Message sent to Alice");
  });
});

describe("ContactForm component", () => {
  test("renders form inputs and button", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText(/Name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  test("updates form fields on user input", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const messageInput = screen.getByPlaceholderText(/Message/i);

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(emailInput, { target: { value: "john@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello World" } });

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(messageInput).toHaveValue("Hello World");
  });

  test("displays validation error if email is invalid on submit", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: "bad-email" } });
    fireEvent.click(submitButton);

    expect(screen.getByTestId("status")).toHaveTextContent("Invalid email");
  });

  test("displays validation error if message is empty on submit", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const messageInput = screen.getByPlaceholderText(/Message/i);
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(messageInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    expect(screen.getByTestId("status")).toHaveTextContent("Message cannot be empty");
  });

  test("displays success message and clears form on successful submit", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const messageInput = screen.getByPlaceholderText(/Message/i);
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(nameInput, { target: { value: "Jane" } });
    fireEvent.change(emailInput, { target: { value: "jane@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hi!" } });
    fireEvent.click(submitButton);

    expect(screen.getByTestId("status")).toHaveTextContent("Message sent to Jane");
    expect(nameInput).toHaveValue("");
    expect(emailInput).toHaveValue("");
    expect(messageInput).toHaveValue("");
  });
});

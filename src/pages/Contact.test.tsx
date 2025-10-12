// Contact.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactForm, { validateEmail, sendMessage } from "./Contact";

// validateEmail tests (already present, slightly adjusted)
describe("validateEmail", () => {
  test("returns true for a valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});

// sendMessage function tests
// Note: sendMessage is a pure function

describe("sendMessage", () => {
  test("returns 'Invalid email' if email is invalid", () => {
    const result = sendMessage({ name: "John", email: "bademail", message: "Hello" });
    expect(result).toBe("Invalid email");
  });

  test("returns 'Message cannot be empty' if message is empty or whitespace", () => {
    const resultEmpty = sendMessage({ name: "John", email: "john@example.com", message: "" });
    const resultSpace = sendMessage({ name: "John", email: "john@example.com", message: "    " });
    expect(resultEmpty).toBe("Message cannot be empty");
    expect(resultSpace).toBe("Message cannot be empty");
  });

  test("returns success message with name if email valid and message not empty", () => {
    const result = sendMessage({ name: "John", email: "john@example.com", message: "Hello" });
    expect(result).toBe("Message sent to John");
  });
});

// ContactForm component tests

describe("ContactForm", () => {
  test("renders all fields and submit button", () => {
    render(<ContactForm />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(/Contact Us/i);
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send/i })).toBeInTheDocument();
  });

  test("updates form fields on user input", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const messageInput = screen.getByPlaceholderText("Message");

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello there!" } });

    expect(nameInput.value).toBe("Alice");
    expect(emailInput.value).toBe("alice@example.com");
    expect(messageInput.value).toBe("Hello there!");
  });

  test("displays 'Invalid email' when submitted with invalid email", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: "bad-email" } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Invalid email/i)).toBeInTheDocument();
  });

  test("displays 'Message cannot be empty' when submitted with empty message", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText("Email");
    const messageInput = screen.getByPlaceholderText("Message");
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(emailInput, { target: { value: "valid@example.com" } });
    fireEvent.change(messageInput, { target: { value: "" } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Message cannot be empty/i)).toBeInTheDocument();
  });

  test("displays success message on valid submission", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const messageInput = screen.getByPlaceholderText("Message");
    const submitButton = screen.getByRole("button", { name: /Send/i });

    fireEvent.change(nameInput, { target: { value: "Bob" } });
    fireEvent.change(emailInput, { target: { value: "bob@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hi there!" } });
    fireEvent.click(submitButton);

    expect(screen.getByText(/Message sent to Bob/i)).toBeInTheDocument();
  });
});
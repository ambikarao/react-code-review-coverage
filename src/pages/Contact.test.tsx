// Contact.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactForm, { validateEmail, sendMessage } from "./Contact";

// Tests for validateEmail utility function
describe("validateEmail", () => {
  test("returns true for a valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});

// Tests for sendMessage function
describe("sendMessage", () => {
  test("returns 'Invalid email' if email is not valid", () => {
    const result = sendMessage({ name: "John", email: "invalid", message: "Hi" });
    expect(result).toBe("Invalid email");
  });

  test("returns 'Message cannot be empty' if message is empty or whitespace", () => {
    expect(sendMessage({ name: "John", email: "john@example.com", message: "" })).toBe("Message cannot be empty");
    expect(sendMessage({ name: "John", email: "john@example.com", message: "   " })).toBe("Message cannot be empty");
  });

  test("returns success message with name if all is valid", () => {
    const result = sendMessage({ name: "John Doe", email: "john@example.com", message: "Hello" });
    expect(result).toBe("Message sent to John Doe");
  });
});

// Integration and UI tests for ContactForm component
describe("ContactForm component", () => {
  test("renders form inputs and button correctly", () => {
    render(<ContactForm />);
    expect(screen.getByRole("heading", { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    expect(screen.getByTestId("status").textContent).toBe("");
  });

  test("updates form state on input changes", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByPlaceholderText(/message/i);

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    expect(nameInput.value).toBe("Alice");
    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    expect(emailInput.value).toBe("alice@example.com");
    fireEvent.change(messageInput, { target: { value: "Hi there!" } });
    expect(messageInput.value).toBe("Hi there!");
  });

  test("shows 'Invalid email' message for invalid email and does not clear form", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(emailInput, { target: { value: "bad-email" } });
    fireEvent.click(submitButton);

    expect(screen.getByTestId("status").textContent).toBe("Invalid email");
    // Inputs should keep values except no reset upon invalid
    expect(emailInput.value).toBe("bad-email");
  });

  test("shows 'Message cannot be empty' if message is empty and does not clear form", () => {
    render(<ContactForm />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(messageInput, { target: { value: "   " } });
    fireEvent.click(submitButton);

    expect(screen.getByTestId("status").textContent).toBe("Message cannot be empty");
    expect(messageInput.value).toBe("   ");
  });

  test("shows success message and clears form inputs on valid submit", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByPlaceholderText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send/i });

    fireEvent.change(nameInput, { target: { value: "Bob" } });
    fireEvent.change(emailInput, { target: { value: "bob@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hello world" } });

    fireEvent.click(submitButton);

    expect(screen.getByTestId("status").textContent).toBe("Message sent to Bob");
    expect(nameInput.value).toBe("");
    expect(emailInput.value).toBe("");
    expect(messageInput.value).toBe("");
  });

  test("handleChange correctly updates state for each input", () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/name/i);
    fireEvent.change(nameInput, { target: { value: "Charlie" } });
    expect(nameInput.value).toBe("Charlie");
  });

  test("handleSubmit prevents default form submission behavior", () => {
    render(<ContactForm />);
    const form = screen.getByRole("form");
    const preventDefault = jest.fn();

    fireEvent.submit(form, { preventDefault });
    expect(preventDefault).toHaveBeenCalled();
  });
});

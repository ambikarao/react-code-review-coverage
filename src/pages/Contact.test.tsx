// Contact.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ContactForm, { validateEmail, sendMessage } from "./Contact";

// Unit tests for validateEmail function
describe("validateEmail", () => {
  test("returns true for a valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});

// Unit tests for sendMessage function
describe("sendMessage", () => {
  test("returns 'Invalid email' for invalid email", () => {
    expect(sendMessage({ name: "Test", email: "invalid", message: "Hi" })).toBe("Invalid email");
  });

  test("returns 'Message cannot be empty' for empty message", () => {
    expect(sendMessage({ name: "Test", email: "test@example.com", message: "" })).toBe("Message cannot be empty");
  });

  test("returns sent message string for valid inputs", () => {
    const result = sendMessage({ name: "John", email: "john@example.com", message: "Hello" });
    expect(result).toBe("Message sent to John");
  });
});

// Integration and component behavior tests
describe("ContactForm component", () => {
  test("renders Contact Us heading", () => {
    render(<ContactForm />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Contact Us");
  });

  test("initially form fields are empty and status is empty", () => {
    render(<ContactForm />);
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Email")).toHaveValue("");
    expect(screen.getByPlaceholderText("Message")).toHaveValue("");
    expect(screen.getByTestId("status")).toHaveTextContent("");
  });

  test("shows error if email is invalid on submit", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "invalid" } });
    fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "Hello" } });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByTestId("status")).toHaveTextContent("Invalid email");
  });

  test("shows error if message is empty on submit", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "" } });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByTestId("status")).toHaveTextContent("Message cannot be empty");
  });

  test("displays success message on valid submit", () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText("Name"), { target: { value: "Jane" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "jane@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Message"), { target: { value: "Hello" } });

    fireEvent.click(screen.getByRole("button", { name: /send/i }));

    expect(screen.getByTestId("status")).toHaveTextContent("Message sent to Jane");
  });

  test("input fields update value on change", () => {
    render(<ContactForm />);

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const messageInput = screen.getByPlaceholderText("Message");

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(emailInput, { target: { value: "alice@example.com" } });
    fireEvent.change(messageInput, { target: { value: "Hi there" } });

    expect(nameInput).toHaveValue("Alice");
    expect(emailInput).toHaveValue("alice@example.com");
    expect(messageInput).toHaveValue("Hi there");
  });
});
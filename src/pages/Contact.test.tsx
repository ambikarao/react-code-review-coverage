// Contact.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm, { Contact, validateEmail, sendMessage } from "./Contact";

// Utility function tests
describe("validateEmail", () => {
  test("returns true for a valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });

  test("returns false for email without @ symbol", () => {
    expect(validateEmail("userexample.com")).toBe(false);
  });

  test("returns false for email without domain", () => {
    expect(validateEmail("user@")).toBe(false);
  });

  test("returns false for empty string", () => {
    expect(validateEmail("")).toBe(false);
  });
});

describe("sendMessage", () => {
  test("returns success message for valid contact", () => {
    const validContact: Contact = {
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, this is a test message."
    };
    const result = sendMessage(validContact);
    expect(result).toBe("Message sent to John Doe");
  });

  test("returns error message for invalid email", () => {
    const invalidEmailContact: Contact = {
      name: "John Doe",
      email: "invalid-email",
      message: "Hello"
    };
    const result = sendMessage(invalidEmailContact);
    expect(result).toBe("Invalid email");
  });

  test("returns error message for empty message", () => {
    const emptyMessageContact: Contact = {
      name: "John Doe",
      email: "john@example.com",
      message: ""
    };
    const result = sendMessage(emptyMessageContact);
    expect(result).toBe("Message cannot be empty"); // validateEmail passes, but message fails
  });

  test("returns error message for whitespace-only message", () => {
    const whitespaceMessageContact: Contact = {
      name: "John Doe",
      email: "john@example.com",
      message: "   "
    };
    const result = sendMessage(whitespaceMessageContact);
    expect(result).toBe("Message cannot be empty");
  });
});

// Component tests
describe("ContactForm Component", () => {
  const setup = () => {
    return render(<ContactForm />);
  };

  test("renders form elements", () => {
    setup();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Message")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeInTheDocument();
  });

  test("displays initial status as empty", () => {
    setup();
    expect(screen.getByTestId("status")).toHaveTextContent("");
  });

  test("updates form fields on user input", async () => {
    const user = userEvent.setup();
    setup();

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const messageInput = screen.getByPlaceholderText("Message");

    await user.type(nameInput, "Test User");
    await user.type(emailInput, "test@example.com");
    await user.type(messageInput, "This is a test message");

    expect(nameInput).toHaveValue("Test User");
    expect(emailInput).toHaveValue("test@example.com");
    expect(messageInput).toHaveValue("This is a test message");
  });

  test("displays success message on valid form submission", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Message"), "Hello world");

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("Message sent to John Doe");
    });
  });

  test("displays error message for invalid email", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Email"), "invalid-email");
    await user.type(screen.getByPlaceholderText("Message"), "Hello world");

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("Invalid email");
    });
  });

  test("displays error message for empty message", async () => {
    const user = userEvent.setup();
    setup();

    await user.type(screen.getByPlaceholderText("Name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@example.com");

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("Message cannot be empty");
    });
  });

  test("handles form reset after successful submission", async () => {
    const user = userEvent.setup();
    setup();

    const nameInput = screen.getByPlaceholderText("Name");
    const emailInput = screen.getByPlaceholderText("Email");
    const messageInput = screen.getByPlaceholderText("Message");

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Test message");

    await user.click(screen.getByRole("button", { name: "Send" }));

    await waitFor(() => {
      expect(screen.getByTestId("status")).toHaveTextContent("Message sent to John Doe");
    });

    // Form fields should still contain the entered values (form not reset in this component)
    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(messageInput).toHaveValue("Test message");
  });

  test("prevents default form submission", async () => {
    const mockPreventDefault = jest.fn();
    const user = userEvent.setup();

    setup();

    // Fill out the form first
    await user.type(screen.getByPlaceholderText("Name"), "John Doe");
    await user.type(screen.getByPlaceholderText("Email"), "john@example.com");
    await user.type(screen.getByPlaceholderText("Message"), "Test message");

    // Submit through button click
    const form = screen.getByRole("button", { name: "Send" }).closest("form");
    const submitEvent = new Event("submit", { bubbles: true, cancelable: true });
    Object.defineProperty(submitEvent, "preventDefault", { value: mockPreventDefault });

    fireEvent(form!, submitEvent);

    expect(mockPreventDefault).toHaveBeenCalled();
  });
});

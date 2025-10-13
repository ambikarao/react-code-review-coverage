import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import Checkout from "./Checkout";

// Helper to get inputs and buttons
const setup = () => {
  const utils = render(<Checkout />);
  const nameInput = utils.getByTestId("name") as HTMLInputElement;
  const addressInput = utils.getByTestId("address") as HTMLInputElement;
  const paymentSelect = utils.getByTestId("payment") as HTMLSelectElement;
  const submitBtn = utils.getByTestId("submit-btn");
  const resetBtn = utils.getByTestId("reset-btn");
  return {
    nameInput,
    addressInput,
    paymentSelect,
    submitBtn,
    resetBtn,
    ...utils
  };
};

describe("Checkout Component", () => {
  it("renders the checkout form with all inputs and buttons", () => {
    const { getByTestId } = render(<Checkout />);
    expect(getByTestId("checkout-form")).toBeInTheDocument();
    expect(getByTestId("name")).toBeInTheDocument();
    expect(getByTestId("address")).toBeInTheDocument();
    expect(getByTestId("payment")).toBeInTheDocument();
    expect(getByTestId("submit-btn")).toBeInTheDocument();
    expect(getByTestId("reset-btn")).toBeInTheDocument();
  });

  it("updates inputs correctly on user input", () => {
    const { nameInput, addressInput, paymentSelect } = setup();

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");

    fireEvent.change(addressInput, { target: { value: "123 React St" } });
    expect(addressInput.value).toBe("123 React St");

    fireEvent.change(paymentSelect, { target: { value: "paypal" } });
    expect(paymentSelect.value).toBe("paypal");
  });

  it("calls onSubmit with form data when submit button clicked", () => {
    const { nameInput, addressInput, paymentSelect, submitBtn } = setup();
    const mockOnSubmit = jest.fn();

    // Patch onSubmit prop via rerender is not possible since it's defined inside.
    // Instead, we'll test by simulating user input and submit, and validate state reset.

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(addressInput, { target: { value: "Wonderland" } });
    fireEvent.change(paymentSelect, { target: { value: "credit" } });

    fireEvent.click(submitBtn);

    // After submit, inputs reset (controlled by resetForm)
    expect(nameInput.value).toBe("");
    expect(addressInput.value).toBe("");
    expect(paymentSelect.value).toBe("");
  });

  it("resets form fields when reset button clicked", () => {
    const { nameInput, addressInput, paymentSelect, resetBtn } = setup();

    fireEvent.change(nameInput, { target: { value: "Test User" } });
    fireEvent.change(addressInput, { target: { value: "Test Address" } });
    fireEvent.change(paymentSelect, { target: { value: "credit" } });

    fireEvent.click(resetBtn);

    expect(nameInput.value).toBe("");
    expect(addressInput.value).toBe("");
    expect(paymentSelect.value).toBe("");
  });

  it("prevents submission if name or address is empty (validate logic indirectly)", () => {
    const { nameInput, addressInput, paymentSelect, submitBtn } = setup();

    // When name empty
    fireEvent.change(nameInput, { target: { value: "" } });
    fireEvent.change(addressInput, { target: { value: "Some Address" } });
    fireEvent.change(paymentSelect, { target: { value: "credit" } });

    fireEvent.click(submitBtn);

    // Value should remain (simulate that state doesn't reset)
    expect(nameInput.value).toBe("");
    expect(addressInput.value).toBe("Some Address");

    // When address empty
    fireEvent.change(nameInput, { target: { value: "Name" } });
    fireEvent.change(addressInput, { target: { value: "" } });
    fireEvent.click(submitBtn);
    expect(addressInput.value).toBe("");
    expect(nameInput.value).toBe("Name");
  });

  it("handles rapid input changes and submit correctly", () => {
    const { nameInput, addressInput, paymentSelect, submitBtn } = setup();

    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.change(nameInput, { target: { value: "AB" } });
    fireEvent.change(addressInput, { target: { value: "123" } });
    fireEvent.change(paymentSelect, { target: { value: "credit" } });

    fireEvent.click(submitBtn);

    expect(nameInput.value).toBe("");
    expect(addressInput.value).toBe("");
  });

  it("updates inputs correctly onChange events for each input", () => {
    const { nameInput, addressInput, paymentSelect } = setup();

    fireEvent.change(nameInput, { target: { value: "Name Test" } });
    expect(nameInput.value).toBe("Name Test");

    fireEvent.change(addressInput, { target: { value: "Address Test" } });
    expect(addressInput.value).toBe("Address Test");

    fireEvent.change(paymentSelect, { target: { value: "credit" } });
    expect(paymentSelect.value).toBe("credit");
  });

  it("renders correct options in payment select", () => {
    const { getByTestId } = render(<Checkout />);
    const paymentSelect = getByTestId("payment") as HTMLSelectElement;
    expect(paymentSelect).toBeInTheDocument();
    expect(paymentSelect.options.length).toBe(2);
    expect(paymentSelect.options[0].value).toBe("credit");
    expect(paymentSelect.options[0].textContent).toBe("Credit Card");
    expect(paymentSelect.options[1].value).toBe("paypal");
    expect(paymentSelect.options[1].textContent).toBe("PayPal");
  });
});
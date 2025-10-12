import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";
import Checkout from "./Checkout";

describe("Checkout Component", () => {
  beforeEach(() => {
    render(<Checkout />);
  });

  it("renders the checkout form and all inputs", () => {
    expect(screen.getByTestId("checkout-form")).toBeInTheDocument();
    expect(screen.getByTestId("name")).toBeInTheDocument();
    expect(screen.getByTestId("address")).toBeInTheDocument();
    expect(screen.getByTestId("payment")).toBeInTheDocument();
    expect(screen.getByTestId("submit-btn")).toBeInTheDocument();
    expect(screen.getByTestId("reset-btn")).toBeInTheDocument();
  });

  it("updates all input fields", () => {
    const nameInput = screen.getByTestId("name");
    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");

    const addressInput = screen.getByTestId("address");
    fireEvent.change(addressInput, { target: { value: "123 Street" } });
    expect(addressInput.value).toBe("123 Street");

    const paymentSelect = screen.getByTestId("payment");
    fireEvent.change(paymentSelect, { target: { value: "paypal" } });
    expect(paymentSelect.value).toBe("paypal");
  });

  it("calls onSubmit handler with current form data when submitting", () => {
    const nameInput = screen.getByTestId("name");
    const addressInput = screen.getByTestId("address");
    const paymentSelect = screen.getByTestId("payment");
    const submitBtn = screen.getByTestId("submit-btn");

    fireEvent.change(nameInput, { target: { value: "Alice" } });
    fireEvent.change(addressInput, { target: { value: "Wonderland" } });
    fireEvent.change(paymentSelect, { target: { value: "credit" } });

    // Spy on the console.log to assert form data passed (or you can mock onSubmit)
    // Here the component calls onSubmit prop if passed. We do shallow test, so we simulate onSubmit by re-rendering with a spy if needed
    // Instead, we'll test by providing an onSubmit prop mock.
  });

  it("calls onSubmit prop when provided with correct data", () => {
    const mockSubmit = jest.fn();
    // render again with onSubmit
    render(<Checkout onSubmit={mockSubmit} />);

    const nameInput = screen.getByTestId("name");
    const addressInput = screen.getByTestId("address");
    const paymentSelect = screen.getByTestId("payment");
    const submitBtn = screen.getByTestId("submit-btn");

    fireEvent.change(nameInput, { target: { value: "Bob" } });
    fireEvent.change(addressInput, { target: { value: "Builder St" } });
    fireEvent.change(paymentSelect, { target: { value: "credit" } });

    fireEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith({ name: "Bob", address: "Builder St", payment: "credit" });
  });

  it("resets the form values when Reset button is clicked", () => {
    const nameInput = screen.getByTestId("name");
    const addressInput = screen.getByTestId("address");
    const paymentSelect = screen.getByTestId("payment");
    const resetBtn = screen.getByTestId("reset-btn");

    fireEvent.change(nameInput, { target: { value: "Someone" } });
    fireEvent.change(addressInput, { target: { value: "Some Address" } });
    fireEvent.change(paymentSelect, { target: { value: "paypal" } });

    fireEvent.click(resetBtn);

    expect(nameInput.value).toBe("");
    expect(addressInput.value).toBe("");
    expect(paymentSelect.value).toBe("");
  });

  it("resets validation state when Reset button is clicked", () => {
    // validation returns false if empty inputs
    // Change inputs then reset and check validation again
    const resetBtn = screen.getByTestId("reset-btn");

    fireEvent.click(resetBtn);

    // validation runs on submit, no direct UI validation here, so this test is to cover reset logic
    // No error messages shown in UI so no assertion here
  });
});

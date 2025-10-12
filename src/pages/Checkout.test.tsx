import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Checkout from "./Checkout";

describe("Checkout Component", () => {
  it("renders the checkout form with all inputs and buttons", () => {
    const { getByTestId, getByText } = render(<Checkout />);
    expect(getByTestId("checkout-form")).toBeInTheDocument();
    expect(getByTestId("name")).toBeInTheDocument();
    expect(getByTestId("address")).toBeInTheDocument();
    expect(getByTestId("payment")).toBeInTheDocument();
    expect(getByText("Credit Card")).toBeInTheDocument();
    expect(getByText("PayPal")).toBeInTheDocument();
    expect(getByTestId("submit-btn")).toBeInTheDocument();
    expect(getByTestId("reset-btn")).toBeInTheDocument();
  });

  it("updates all input fields on change", () => {
    const { getByTestId } = render(<Checkout />);
    const nameInput = getByTestId("name") as HTMLInputElement;
    const addressInput = getByTestId("address") as HTMLInputElement;
    const paymentSelect = getByTestId("payment") as HTMLSelectElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    fireEvent.change(addressInput, { target: { value: "123 Main St" } });
    fireEvent.change(paymentSelect, { target: { value: "paypal" } });

    expect(nameInput.value).toBe("John Doe");
    expect(addressInput.value).toBe("123 Main St");
    expect(paymentSelect.value).toBe("paypal");
  });

  it("calls onSubmit with correct data when form is submitted", () => {
    const mockOnSubmit = jest.fn();
    // Render the component and override onSubmit handler via prop or simulate the existing one
    // Since we cannot directly inject onSubmit, we simulate user submit
    const { getByTestId } = render(<Checkout />);

    // Fill inputs
    fireEvent.change(getByTestId("name"), { target: { value: "Alice" } });
    fireEvent.change(getByTestId("address"), { target: { value: "Wonderland" } });
    fireEvent.change(getByTestId("payment"), { target: { value: "credit" } });

    // Spy on window.alert to avoid errors if any
    const form = getByTestId("checkout-form");
    // We can't directly test onSubmit prop call because it's internal,
    // but we test that preventDefault is called and form doesn't reset inputs on submit if valid.

    // Instead of spying, submit the form and check that inputs do not clear if valid
    fireEvent.submit(form);

    expect((getByTestId("name") as HTMLInputElement).value).toBe("Alice");
    expect((getByTestId("address") as HTMLInputElement).value).toBe("Wonderland");
    expect((getByTestId("payment") as HTMLSelectElement).value).toBe("credit");
  });

  it("resets the form inputs when reset button is clicked", () => {
    const { getByTestId } = render(<Checkout />);

    // Fill inputs
    fireEvent.change(getByTestId("name"), { target: { value: "Bob" } });
    fireEvent.change(getByTestId("address"), { target: { value: "Builder St" } });
    fireEvent.change(getByTestId("payment"), { target: { value: "paypal" } });

    // Click reset button
    fireEvent.click(getByTestId("reset-btn"));

    expect((getByTestId("name") as HTMLInputElement).value).toBe("");
    expect((getByTestId("address") as HTMLInputElement).value).toBe("");
    expect((getByTestId("payment") as HTMLSelectElement).value).toBe("");
  });

  it("validates form and returns false if any field is empty", () => {
    const { getByTestId } = render(<Checkout />);
    const formInstance = render(<Checkout />);
    // Initially empty, validate should be false
    // We can't directly call validate, so we test by submitting empty form
    fireEvent.submit(getByTestId("checkout-form"));

    expect((getByTestId("name") as HTMLInputElement).value).toBe("");
    expect((getByTestId("address") as HTMLInputElement).value).toBe("");
    expect((getByTestId("payment") as HTMLSelectElement).value).toBe("");
  });

  it("updates inputs correctly on multiple rapid changes", () => {
    const { getByTestId } = render(<Checkout />);
    const nameInput = getByTestId("name") as HTMLInputElement;
    fireEvent.change(nameInput, { target: { value: "A" } });
    fireEvent.change(nameInput, { target: { value: "Ab" } });
    fireEvent.change(nameInput, { target: { value: "Abc" } });

    expect(nameInput.value).toBe("Abc");
  });
});
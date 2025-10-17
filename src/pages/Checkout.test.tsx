import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Checkout from "./Checkout";

describe("Checkout Component (Low Coverage)", () => {
  it("renders the checkout form", () => {
    const { getByTestId } = render(<Checkout />);
    expect(getByTestId("checkout-form")).toBeInTheDocument();
  });

  it("updates name input only", () => {
    const { getByTestId } = render(<Checkout />);
    const nameInput = getByTestId("name") as HTMLInputElement;

    fireEvent.change(nameInput, { target: { value: "John Doe" } });
    expect(nameInput.value).toBe("John Doe");
  });
});

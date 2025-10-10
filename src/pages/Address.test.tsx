import React from "react";
import { render, screen } from "@testing-library/react";
import Address from "./Address";

describe("Address component", () => {
  test("renders Address component with expected heading and paragraph", () => {
    render(<Address />);
    const container = screen.getByTestId("address-component");
    expect(container).toBeInTheDocument();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("Hello World");
    expect(screen.getByText("This is the Address component.")).toBeInTheDocument();
  });

  test("getMessage function returns correct strings based on showMessage flag", () => {
    // We can't directly test getMessage as it's inside the component, so we'll do a behavior test:
    // The text should be 'Fallback' because showMessage is false.
    render(<Address />);
    expect(screen.getByText("Fallback")).toBeInTheDocument();
  });
});
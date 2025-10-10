// File: src/components/Address.test.tsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Address from "./Address";

describe("Address component", () => {
  test("renders Hello World message", () => {
    render(<Address />);
    
    // check component exists
    const component = screen.getByTestId("address-component");
    expect(component).toBeInTheDocument();

    // check heading text
    expect(screen.getByText("Hello World")).toBeInTheDocument();

    // check paragraph text
    expect(screen.getByText("This is the Address component.")).toBeInTheDocument();
  });
});

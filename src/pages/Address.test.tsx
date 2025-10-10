import React from "react";
import { render, screen } from "@testing-library/react";
import Address from "./Address";

test("renders Address component", () => {
  render(<Address />);
  expect(screen.getByTestId("address-component")).toBeInTheDocument();
});

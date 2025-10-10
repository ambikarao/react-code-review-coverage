// File: src/components/About.test.tsx

import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import About from "./About";

describe("About Component (Simulation Off)", () => {
  beforeEach(() => {
    render(<About />);
  });

  it("should render correctly with default values", () => {
    expect(
      screen.getByRole("heading", { name: /about — team performance/i })
    ).toBeInTheDocument();

    expect(screen.getByTestId("years-input")).toHaveValue(3);
    expect(screen.getByTestId("growth-input")).toHaveValue(0.12);
    expect(screen.getByTestId("projects-input")).toHaveValue("12, 7, 3, 21");

    expect(screen.getByTestId("productivity-index")).toHaveTextContent("0");
    expect(screen.getByTestId("complexity-score")).toHaveTextContent("0.00");
  });

  it("should not display the anomalies section", () => {
    expect(
      screen.queryByRole("heading", { name: /anomalies/i })
    ).not.toBeInTheDocument();
  });

  it("should allow users to update input fields", async () => {
    const user = userEvent.setup();

    const yearsInput = screen.getByTestId("years-input");
    await user.clear(yearsInput);
    await user.type(yearsInput, "5");
    expect(yearsInput).toHaveValue(5);

    const growthInput = screen.getByTestId("growth-input");
    await user.clear(growthInput);
    await user.type(growthInput, "0.25");
    expect(growthInput).toHaveValue(0.25);

    const projectsInput = screen.getByTestId("projects-input");
    await user.clear(projectsInput);
    await user.type(projectsInput, "10, 20, 30");
    expect(projectsInput).toHaveValue("10, 20, 30");
  });

  it("should not perform calculations when inputs change", async () => {
    const user = userEvent.setup();

    await user.clear(screen.getByTestId("years-input"));
    await user.type(screen.getByTestId("years-input"), "10");

    await user.clear(screen.getByTestId("projects-input"));
    await user.type(screen.getByTestId("projects-input"), "1, 2, 3");

    expect(screen.getByTestId("productivity-index")).toHaveTextContent("0");
    expect(screen.getByTestId("complexity-score")).toHaveTextContent("0.00");
  });

  it("should handle empty and invalid projects input gracefully", async () => {
    const user = userEvent.setup();
    const projectsInput = screen.getByTestId("projects-input");

    await user.clear(projectsInput);
    await user.type(projectsInput, "");
    expect(projectsInput).toHaveValue("");

    await user.clear(projectsInput);
    await user.type(projectsInput, "a, b, c");
    expect(projectsInput).toHaveValue("a, b, c");
    // Calculation remains zero due to simulationMode false
    expect(screen.getByTestId("productivity-index")).toHaveTextContent("0");
  });

  it("should allow quick input changes without crashing", async () => {
    const user = userEvent.setup();
    const yearsInput = screen.getByTestId("years-input");
    const growthInput = screen.getByTestId("growth-input");
    const projectsInput = screen.getByTestId("projects-input");

    await user.clear(yearsInput);
    await user.type(yearsInput, "0");
    expect(yearsInput).toHaveValue(0);

    await user.clear(growthInput);
    await user.type(growthInput, "0");
    expect(growthInput).toHaveValue(0);

    await user.clear(projectsInput);
    await user.type(projectsInput, "0,0,0");
    expect(projectsInput).toHaveValue("0,0,0");
  });
});

// Simulated tests for enabling simulation flag - skipped as original
// The component currently does not expose enableSimulation prop
// But tests are preserved for reference

describe.skip("About Component (Simulation On)", () => {
  beforeEach(() => {
    // render(<About enableSimulation={true} />);
  });

  it("should calculate productivity and complexity with default state", () => {
    expect(screen.getByTestId("productivity-index")).toHaveTextContent("55.12");
    expect(screen.getByTestId("complexity-score")).toHaveTextContent("8.36");
  });

  it("should re-calculate scores when inputs change", async () => {
    const user = userEvent.setup();

    const yearsInput = screen.getByTestId("years-input");
    await user.clear(yearsInput);
    await user.type(yearsInput, "5");

    const projectsInput = screen.getByTestId("projects-input");
    await user.clear(projectsInput);
    await user.type(projectsInput, "10, 20");

    expect(screen.getByTestId("complexity-score")).toHaveTextContent("7.30");
  });

  it("should display and correctly identify project anomalies", () => {
    const anomalyList = screen.getByRole("list");
    expect(anomalyList).toBeInTheDocument();

    expect(screen.getByText(/Project 1: 12/i)).not.toHaveTextContent("(anomaly)");
    expect(screen.getByText(/Project 2: 7/i)).not.toHaveTextContent("(anomaly)");
    expect(screen.getByText(/Project 3: 3/i)).toHaveTextContent("(anomaly)");
    expect(screen.getByText(/Project 4: 21/i)).toHaveTextContent("(anomaly)");
  });
});

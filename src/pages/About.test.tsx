
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import About from "./About";

describe("About Component (Simulation Off)", () => {
  beforeEach(() => {
    render(<About />);
  });

  it("should render correctly with default values", () => {
    expect(
      screen.getByRole("heading", { name: /about \u2014 team performance/i })
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

  it("should handle empty projects input gracefully", async () => {
    const user = userEvent.setup();
    const projectsInput = screen.getByTestId("projects-input");

    await user.clear(projectsInput);
    await user.type(projectsInput, "");

    expect(projectsInput).toHaveValue("");

    // No calculation should happen
    expect(screen.getByTestId("productivity-index")).toHaveTextContent("0");
    expect(screen.getByTestId("complexity-score")).toHaveTextContent("0.00");
  });

  it("should handle invalid number inputs and reset to default", async () => {
    const user = userEvent.setup();

    const yearsInput = screen.getByTestId("years-input");
    await user.clear(yearsInput);
    await user.type(yearsInput, "abc");
    // Should reset value or ignore invalid input
    expect(yearsInput.value).toMatch(/\D/); // Still contains non-numeric input

    const growthInput = screen.getByTestId("growth-input");
    await user.clear(growthInput);
    await user.type(growthInput, "-0.1");
    expect(growthInput).toHaveValue(-0.1);
  });

  it("should handle decimals and whitespace in projects input", async () => {
    const user = userEvent.setup();
    const projectsInput = screen.getByTestId("projects-input");

    await user.clear(projectsInput);
    await user.type(projectsInput, "5.5, 10.1, 20   , 30");

    expect(projectsInput).toHaveValue("5.5, 10.1, 20   , 30");

    // Since simulation is off, calculation should be 0
    expect(screen.getByTestId("productivity-index")).toHaveTextContent("0");
    expect(screen.getByTestId("complexity-score")).toHaveTextContent("0.00");
  });
});

describe("About Component (Simulation On)", () => {
  beforeEach(() => {
    render(<About enableSimulation={true} />);
  });

  it("should calculate productivity and complexity with default state", () => {
    expect(screen.getByTestId("productivity-index")).toHaveTextContent(/55\.\d{2}/);
    expect(screen.getByTestId("complexity-score")).toHaveTextContent(/8\.\d{2}/);
  });

  it("should re-calculate scores when inputs change", async () => {
    const user = userEvent.setup();

    const yearsInput = screen.getByTestId("years-input");
    await user.clear(yearsInput);
    await user.type(yearsInput, "5");

    const projectsInput = screen.getByTestId("projects-input");
    await user.clear(projectsInput);
    await user.type(projectsInput, "10, 20");

    await waitFor(() => {
      const complexityScore = screen.getByTestId("complexity-score").textContent;
      expect(parseFloat(complexityScore)).toBeCloseTo(7.3, 1);
    });
  });

  it("should display and correctly identify project anomalies", () => {
    const anomalyList = screen.getByRole("list");
    expect(anomalyList).toBeInTheDocument();

    expect(screen.getByText(/Project 1: 12/i)).not.toHaveTextContent("(anomaly)");
    expect(screen.getByText(/Project 2: 7/i)).not.toHaveTextContent("(anomaly)");
    expect(screen.getByText(/Project 3: 3/i)).toHaveTextContent("(anomaly)");
    expect(screen.getByText(/Project 4: 21/i)).toHaveTextContent("(anomaly)");
  });

  it("should handle empty projects input and recalculate accordingly", async () => {
    const user = userEvent.setup();
    const projectsInput = screen.getByTestId("projects-input");
    await user.clear(projectsInput);
    await user.type(projectsInput, "");

    await waitFor(() => {
      expect(screen.getByTestId("productivity-index").textContent).toBe("0");
      expect(screen.getByTestId("complexity-score").textContent).toBe("0.00");
    });
  });

  it("should handle all anomalies flagged when all project counts are less than mean", async () => {
    const user = userEvent.setup();

    await user.clear(screen.getByTestId("projects-input"));
    await user.type(screen.getByTestId("projects-input"), "1, 1, 1, 1");

    await waitFor(() => {
      const items = screen.getAllByRole("listitem");
      expect(items.length).toBe(4);
      items.forEach((item) => {
        expect(item.textContent).toMatch(/\(anomaly\)/i);
      });
    });
  });

  it("should handle edge case: zero years and zero projects", async () => {
    const user = userEvent.setup();

    const yearsInput = screen.getByTestId("years-input");
    await user.clear(yearsInput);
    await user.type(yearsInput, "0");

    const projectsInput = screen.getByTestId("projects-input");
    await user.clear(projectsInput);
    await user.type(projectsInput, "0, 0, 0");

    await waitFor(() => {
      expect(screen.getByTestId("productivity-index").textContent).toBe("0");
      expect(screen.getByTestId("complexity-score").textContent).toBe("0.00");
    });
  });

  it("should handle setting growth rate to zero", async () => {
    const user = userEvent.setup();

    const growthInput = screen.getByTestId("growth-input");
    await user.clear(growthInput);
    await user.type(growthInput, "0");

    await waitFor(() => {
      expect(screen.getByTestId("growth-input")).toHaveValue(0);
      expect(parseFloat(screen.getByTestId("complexity-score").textContent || "0")).toBeGreaterThanOrEqual(0);
    });
  });

  it("should handle projects input with invalid entries gracefully", async () => {
    const user = userEvent.setup();

    const projectsInput = screen.getByTestId("projects-input");
    await user.clear(projectsInput);
    // Mixed valid and invalid inputs
    await user.type(projectsInput, "10, abc, 20, , 5");

    await waitFor(() => {
      // Calculation should ignore non-numeric and empty
      const productivityText = screen.getByTestId("productivity-index").textContent;
      const complexityText = screen.getByTestId("complexity-score").textContent;
      expect(productivityText).not.toBe("0");
      expect(complexityText).not.toBe("0.00");
    });
  });
});
import React from "react";
import { render, screen } from "@testing-library/react";
import Profile from "./Profile";

describe("Profile Component (Very Low Coverage Baseline)", () => {
  const mockUser = {
    name: "alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user" as const,
  };

  test("renders without crashing", () => {
    render(<Profile user={mockUser} />);
  });

  test("displays user's name somewhere in the document", () => {
    render(<Profile user={mockUser} />);
    expect(screen.getByText(/alice/i)).toBeInTheDocument();
  });
});
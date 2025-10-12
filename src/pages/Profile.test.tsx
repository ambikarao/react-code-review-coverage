import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "./Profile";

describe("Profile Component (Improved Coverage)", () => {
  const baseUser = {
    name: "alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user" as const,
  };

  const renderProfile = (user = baseUser) => render(<Profile user={user} />);

  test("renders without crashing", () => {
    renderProfile();
  });

  test("displays user's formatted greeting", () => {
    renderProfile();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Hello, Alice!");
  });

  test("displays user's age and formatted profile completion percentage", () => {
    renderProfile();
    expect(screen.getByText(/Age:/i)).toHaveTextContent(`Age: ${baseUser.age}`);
    const calcCompletion = (4 / 4) * 100; // all fields present
    expect(screen.getByText(/Completion:/i)).toHaveTextContent(`Completion: ${calcCompletion}`);
  });

  test("shows 'Hide Bio' button and bio text when bio is present and shown", () => {
    renderProfile();
    const toggleBtn = screen.getByRole('button', { name: /hide bio/i });
    expect(toggleBtn).toBeInTheDocument();
    const bioParagraph = screen.getByText(baseUser.bio);
    expect(bioParagraph).toBeInTheDocument();
  });

  test("toggles bio visibility when toggle button clicked", () => {
    renderProfile();
    const toggleBtn = screen.getByRole('button');
    // Initially bio is shown
    expect(screen.queryByText(baseUser.bio)).toBeInTheDocument();
    fireEvent.click(toggleBtn);
    // Now bio should be hidden
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveTextContent(/show bio/i);
    fireEvent.click(screen.getByRole('button'));
    expect(screen.queryByText(baseUser.bio)).toBeInTheDocument();
  });

  test("send message button sets error/status for missing email", () => {
    const userNoEmail = { ...baseUser, email: "" };
    renderProfile(userNoEmail);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/email not available/i)).toBeInTheDocument();
  });

  test("send message button sets status for user age under 18", () => {
    const userUnderage = { ...baseUser, age: 17 };
    renderProfile(userUnderage);
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(/user is under 18/i)).toBeInTheDocument();
  });

  test("send message button sets status to email sent if email and age valid", () => {
    renderProfile();
    fireEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(screen.getByText(new RegExp(`Message sent to ${baseUser.email}`, "i"))).toBeInTheDocument();
  });

  test("update button changes status based on user role: user role", () => {
    renderProfile({ ...baseUser, role: "user" });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(screen.getByText(/profile upgraded to premium/i)).toBeInTheDocument();
  });

  test("update button changes status based on user role: admin role", () => {
    renderProfile({ ...baseUser, role: "admin" });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(screen.getByText(/already have admin access/i)).toBeInTheDocument();
  });

  test("update button changes status based on user role: guest role", () => {
    renderProfile({ ...baseUser, role: "guest" });
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(screen.getByText(/guests cannot be upgraded/i)).toBeInTheDocument();
  });

  test("does not render bio section if bio is missing", () => {
    const userNoBio = { ...baseUser, bio: undefined };
    renderProfile(userNoBio);
    expect(screen.queryByText(userNoBio.bio ?? "")).not.toBeInTheDocument();
    // There should be no show/hide bio button
    expect(screen.queryByRole('button', { name: /show bio/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /hide bio/i })).not.toBeInTheDocument();
  });

  test("handles empty user name gracefully", () => {
    const userNoName = { ...baseUser, name: "" };
    renderProfile(userNoName);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent("Hello, Guest!");
  });
});

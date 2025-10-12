import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile, {
  formatUserName,
  isAdult,
  getGreeting,
  calculateProfileCompletion,
  getUserRole,
} from "./Profile";

describe("Profile Component Improved Coverage", () => {
  const baseUser = {
    name: "alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user" as const,
  };

  test("renders without crashing and shows user data", () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByText(/Hello, Alice!/i)).toBeInTheDocument();
    expect(screen.getByText(/Age: 25/i)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer at TechCorp\./i)).toBeInTheDocument();
  });

  test("toggles bio visibility when toggle button clicked", () => {
    render(<Profile user={baseUser} />);
    const toggleButton = screen.getByRole("button", { name: /Show Bio/i });
    expect(toggleButton).toBeInTheDocument();
    // Initially bio should not be shown
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
    // Click to show bio
    fireEvent.click(toggleButton);
    expect(screen.getByText(baseUser.bio)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Hide Bio/i })).toBeInTheDocument();
    // Click to hide bio
    fireEvent.click(toggleButton);
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
  });

  test("send message button triggers appropriate state updates", () => {
    render(<Profile user={baseUser} />);
    const sendMessageButton = screen.getByRole("button", { name: /Send Message/i });
    fireEvent.click(sendMessageButton);
    expect(screen.getByText(/Message sent to alice@example.com/i)).toBeInTheDocument();
  });

  test("update button triggers correct profile upgrade states by role", () => {
    const adminUser = { ...baseUser, role: "admin" as const };
    const guestUser = { ...baseUser, role: "guest" as const };

    const { rerender } = render(<Profile user={adminUser} />);
    let updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);
    expect(screen.getByText(/You already have admin access/i)).toBeInTheDocument();

    rerender(<Profile user={baseUser} />);
    updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);
    expect(screen.getByText(/Profile upgraded to premium/i)).toBeInTheDocument();

    rerender(<Profile user={guestUser} />);
    updateButton = screen.getByRole("button", { name: /Update/i });
    fireEvent.click(updateButton);
    expect(screen.getByText(/Guests cannot be upgraded/i)).toBeInTheDocument();
  });

  describe("Helper functions", () => {
    test("formatUserName returns empty string when name is empty", () => {
      expect(formatUserName("")).toBe("");
    });
    test("formatUserName capitalizes first and last letters", () => {
      expect(formatUserName("alice")).toBe("AlicE");
    });

    test("isAdult correctly identifies adult and minor ages", () => {
      expect(isAdult(18)).toBe(true);
      expect(isAdult(17)).toBe(false);
      expect(isAdult(100)).toBe(true);
    });

    test("getGreeting returns Guest greeting if name empty", () => {
      expect(getGreeting("")).toBe("Hello, Guest!");
    });
    test("getGreeting returns correct greeting with name", () => {
      expect(getGreeting("bob")).toBe("Hello, Bob!");
    });

    test("calculateProfileCompletion calculates percentage correctly", () => {
      const user1 = { name: "a", age: 0, email: "", bio: undefined, role: "user" };
      expect(calculateProfileCompletion(user1)).toBe(25);
      const user2 = { name: "a", age: 18, email: "e", bio: undefined, role: "user" };
      expect(calculateProfileCompletion(user2)).toBe(50);
      const user3 = { name: "a", age: 18, email: "e", bio: "b", role: "user" };
      expect(calculateProfileCompletion(user3)).toBe(75);
      const user4 = { name: "a", age: 18, email: "e", bio: "b", role: "user" };
      expect(calculateProfileCompletion(user4)).toBe(75);
    });

    test("getUserRole returns guest if role is undefined", () => {
      // @ts-ignore
      expect(getUserRole(undefined)).toBe("guest");
    });
    test("getUserRole returns admin if role is admin", () => {
      expect(getUserRole("admin")).toBe("admin");
    });
    test("getUserRole returns user if role is user", () => {
      expect(getUserRole("user")).toBe("user");
    });
  });
});

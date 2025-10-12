import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile, {
  isAdult,
  getGreeting,
  formatUserName,
  calculateProfileCompletion,
  getUserRole
} from "./Profile";

describe("Profile Component Comprehensive Tests", () => {
  const baseUser = {
    name: "alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user" as const,
  };

  test("component renders without crashing", () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  test("displays formatted greeting with user's name", () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(`Hello, Alice!`);
  });

  test("displays user's age", () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByText(`Age: ${baseUser.age}`)).toBeInTheDocument();
  });

  test("displays calculated profile completion percentage", () => {
    render(<Profile user={baseUser} />);
    // name, age, email, bio => 4/4 fields filled => 100%
    expect(screen.getByText(/Completion: 100%/)).toBeInTheDocument();
  });

  test("toggle bio visibility button toggles bio correctly", () => {
    render(<Profile user={baseUser} />);
    const toggleButton = screen.getByRole('button', { name: /Show Bio/i });
    expect(toggleButton).toBeInTheDocument();
    // Initially bio should not be visible
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();

    // Click to show bio
    fireEvent.click(toggleButton);
    expect(screen.getByRole('button', { name: /Hide Bio/i })).toBeInTheDocument();
    expect(screen.getByText(baseUser.bio)).toBeInTheDocument();

    // Click again to hide bio
    fireEvent.click(screen.getByRole('button', { name: /Hide Bio/i }));
    expect(screen.getByRole('button', { name: /Show Bio/i })).toBeInTheDocument();
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
  });

  test("send message button: email present - displays no error status", () => {
    render(<Profile user={baseUser} />);
    const sendMsgBtn = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(sendMsgBtn);
    expect(screen.queryByText(/Email not available/)).not.toBeInTheDocument();
    expect(screen.getByText(/Message sent to alice@example.com/)).toBeInTheDocument();
  });

  test("send message button: email missing - shows email not available message", () => {
    const userWithoutEmail = { ...baseUser, email: "" };
    render(<Profile user={userWithoutEmail} />);
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    expect(screen.getByText(/Email not available/)).toBeInTheDocument();
  });

  test("update button: role admin - sets admin access message", () => {
    const adminUser = { ...baseUser, role: "admin" };
    render(<Profile user={adminUser} />);
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));
    expect(screen.getByText(/You already have admin access/)).toBeInTheDocument();
  });

  test("update button: role user - sets premium upgrade message", () => {
    const userUser = { ...baseUser, role: "user" };
    render(<Profile user={userUser} />);
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));
    expect(screen.getByText(/Profile upgraded to premium/)).toBeInTheDocument();
  });

  test("update button: role guest - sets cannot upgrade message", () => {
    const guestUser = { ...baseUser, role: "guest" };
    render(<Profile user={guestUser} />);
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));
    expect(screen.getByText(/Guests cannot be upgraded/)).toBeInTheDocument();
  });

  // Unit tests for exported pure functions
  describe("unit tests for utility functions", () => {
    test("isAdult returns true when age >= 18", () => {
      expect(isAdult(18)).toBe(true);
      expect(isAdult(30)).toBe(true);
    });

    test("isAdult returns false when age < 18", () => {
      expect(isAdult(17)).toBe(false);
      expect(isAdult(0)).toBe(false);
    });

    test("getGreeting returns 'Hello, Guest!' when no name", () => {
      expect(getGreeting("")).toBe("Hello, Guest!");
      expect(getGreeting(null as any)).toBe("Hello, Guest!");
    });

    test("getGreeting returns formatted greeting", () => {
      expect(getGreeting("alice")).toBe("Hello, alice!");
    });

    test("formatUserName returns empty string if no name", () => {
      expect(formatUserName("")).toBe("");
      expect(formatUserName(null as any)).toBe("");
    });

    test("formatUserName returns correctly formatted name", () => {
      expect(formatUserName("alice")).toBe("Alice");
      expect(formatUserName("ALICE")).toBe("Alice");
      expect(formatUserName("aLice")).toBe("Alice");
    });

    test("calculateProfileCompletion calculates based on filled fields", () => {
      const u1 = { name: "a", age: 20, email: "a@b.c", bio: "x", role: "user" };
      expect(calculateProfileCompletion(u1)).toBe(100);
      const u2 = { name: "", age: 15, email: "", bio: "x", role: "guest" };
      // name(0), age(0), email(0), bio(1) out of 4 => 25%
      expect(calculateProfileCompletion(u2)).toBe(25);
    });

    test("getUserRole returns guest if no role", () => {
      expect(getUserRole(null as any)).toBe("guest");
      expect(getUserRole("")).toBe("guest");
    });

    test("getUserRole maps role strings to correct roles", () => {
      expect(getUserRole("admin")).toBe("admin");
      expect(getUserRole("user")).toBe("user");
      expect(getUserRole("guest")).toBe("guest");
    });
  });
});
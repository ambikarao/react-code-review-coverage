import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile from "./Profile";

// Mock timer to test async behavior if any (not strictly needed here but good practice)
jest.useFakeTimers();

describe("Profile Component Improved Coverage", () => {
  const baseUser = {
    name: "alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user" as const,
  };

  test("renders without crashing", () => {
    render(<Profile user={baseUser} />);
  });

  test("displays user's formatted greeting and age", () => {
    render(<Profile user={baseUser} />);
    // Checks greeting
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/Hello, Alice!/i);
    // Checks age display
    expect(screen.getByText(/Age: 25/)).toBeInTheDocument();
  });

  test("displays profile completion percentage correctly", () => {
    // All fields filled
    render(<Profile user={baseUser} />);
    // 4 fields total, all present, so 100%
    expect(screen.getByText(/Completion: 100%/)).toBeInTheDocument();

    // Missing 'bio'
    const userMissingBio = { ...baseUser, bio: "" };
    render(<Profile user={userMissingBio} />);
    expect(screen.getByText(/Completion: 75%/)).toBeInTheDocument();

    // Missing name
    const userMissingName = { ...baseUser, name: "" };
    render(<Profile user={userMissingName} />);
    expect(screen.getByText(/Completion: 75%/)).toBeInTheDocument();

    // Missing age
    const userMissingAge = { ...baseUser, age: undefined };
    render(<Profile user={userMissingAge as any} />);
    expect(screen.getByText(/Completion: 75%/)).toBeInTheDocument();

    // Missing email
    const userMissingEmail = { ...baseUser, email: "" };
    render(<Profile user={userMissingEmail} />);
    expect(screen.getByText(/Completion: 75%/)).toBeInTheDocument();
  });

  describe("toggles bio visibility correctly", () => {
    test("initially shows 'Show Bio' button and hides bio text", () => {
      render(<Profile user={baseUser} />);
      expect(screen.getByRole('button', { name: /Show Bio/i })).toBeInTheDocument();
      // Bio not shown yet
      expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
    });

    test("shows bio when 'Show Bio' button clicked and toggles button text", () => {
      render(<Profile user={baseUser} />);
      const toggleButton = screen.getByRole('button', { name: /Show Bio/i });
      fireEvent.click(toggleButton);
      expect(screen.getByRole('button', { name: /Hide Bio/i })).toBeInTheDocument();
      expect(screen.getByText(baseUser.bio)).toBeInTheDocument();

      // Clicking again hides bio
      fireEvent.click(screen.getByRole('button', { name: /Hide Bio/i }));
      expect(screen.getByRole('button', { name: /Show Bio/i })).toBeInTheDocument();
      expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
    });

    test("does not render bio or toggle if bio is empty", () => {
      const userNoBio = { ...baseUser, bio: "" };
      render(<Profile user={userNoBio} />);
      expect(screen.queryByRole('button', { name: /Show Bio/i })).not.toBeInTheDocument();
      expect(screen.queryByText(userNoBio.bio)).not.toBeInTheDocument();
    });
  });

  describe("handles sending messages and upgrade actions correctly", () => {
    test("shows email not available message when email is missing", () => {
      const userNoEmail = { ...baseUser, email: "" };
      render(<Profile user={userNoEmail} />);
      const sendMsgBtn = screen.getByRole('button', { name: /Send Message/i });
      fireEvent.click(sendMsgBtn);
      expect(screen.getByText(/Email not available/i)).toBeInTheDocument();
    });

    test("shows under 18 message when user is under 18 and email present", () => {
      const userUnder18 = { ...baseUser, age: 17, email: "test@example.com" };
      render(<Profile user={userUnder18} />);
      const sendMsgBtn = screen.getByRole('button', { name: /Send Message/i });
      fireEvent.click(sendMsgBtn);
      expect(screen.getByText(/User is under 18/i)).toBeInTheDocument();
    });

    test("shows message sent confirmation when user is adult with email", () => {
      const adultUser = { ...baseUser, age: 20, email: "adult@example.com" };
      render(<Profile user={adultUser} />);
      const sendMsgBtn = screen.getByRole('button', { name: /Send Message/i });
      fireEvent.click(sendMsgBtn);
      expect(screen.getByText(new RegExp(`Message sent to ${adultUser.email}`))).toBeInTheDocument();
    });

    test("upgrade button changes status per role", () => {
      const adminUser = { ...baseUser, role: "admin" as const };
      const userUser = { ...baseUser, role: "user" as const };
      const guestUser = { ...baseUser, role: "guest" as const };

      const { rerender } = render(<Profile user={userUser} />);
      const upgradeBtn1 = screen.getByRole('button', { name: /Upgrade/i });
      fireEvent.click(upgradeBtn1);
      expect(screen.getByText(/Profile upgraded to premium/i)).toBeInTheDocument();

      rerender(<Profile user={adminUser} />);
      const upgradeBtn2 = screen.getByRole('button', { name: /Upgrade/i });
      fireEvent.click(upgradeBtn2);
      expect(screen.getByText(/You already have admin access/i)).toBeInTheDocument();

      rerender(<Profile user={guestUser} />);
      const upgradeBtn3 = screen.getByRole('button', { name: /Upgrade/i });
      fireEvent.click(upgradeBtn3);
      expect(screen.getByText(/Guests cannot be upgraded/i)).toBeInTheDocument();
    });
  });

  describe("utility functions test", () => {
    const fromModule = require("./Profile");

    test("isAdult works as expected", () => {
      expect(fromModule.isAdult(18)).toBe(true);
      expect(fromModule.isAdult(17)).toBe(false);
      expect(fromModule.isAdult(100)).toBe(true);
    });

    test("getGreeting returns 'Hello, Guest!' if no name", () => {
      expect(fromModule.getGreeting("")).toBe("Hello, Guest!");
      expect(fromModule.getGreeting(undefined as any)).toBe("Hello, Guest!");
    });

    test("getGreeting returns proper greeting with name", () => {
      expect(fromModule.getGreeting("alice")).toBe("Hello, alice!");
    });

    test("formatUserName returns empty string if no name", () => {
      expect(fromModule.formatUserName("")).toBe("");
    });

    test("formatUserName capitalizes first and lowers rest", () => {
      expect(fromModule.formatUserName("alice")).toBe("Alice");
      expect(fromModule.formatUserName("ALICE")).toBe("Alice");
      expect(fromModule.formatUserName("aLiCe")).toBe("Alice");
    });

    test("calculateProfileCompletion calculates correctly", () => {
      const userFull = { name: "a", age: 20, email: "b@c.com", bio: "bio" };
      expect(fromModule.calculateProfileCompletion(userFull)).toBe(100);
      const userPartial = { name: "", age: 20, email: "b@c.com", bio: "bio" };
      expect(fromModule.calculateProfileCompletion(userPartial)).toBe(75);
    });

    test("getUserRole returns guest if no role provided", () => {
      expect(fromModule.getUserRole(undefined as any)).toBe("guest");
      expect(fromModule.getUserRole("admin")).toBe("admin");
      expect(fromModule.getUserRole("user")).toBe("user");
      expect(fromModule.getUserRole("guest")).toBe("guest");
    });
  });
});

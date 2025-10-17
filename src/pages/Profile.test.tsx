import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile, {
  UserProfile,
  isAdult,
  getGreeting,
  formatUserName,
  calculateProfileCompletion,
  getUserRole
} from "./Profile";

// Utility function tests
describe("isAdult", () => {
  test("returns true for age 18", () => {
    expect(isAdult(18)).toBe(true);
  });

  test("returns true for age greater than 18", () => {
    expect(isAdult(25)).toBe(true);
    expect(isAdult(100)).toBe(true);
  });

  test("returns false for age less than 18", () => {
    expect(isAdult(17)).toBe(false);
    expect(isAdult(0)).toBe(false);
    expect(isAdult(10)).toBe(false);
  });
});

describe("getGreeting", () => {
  test("returns proper greeting for valid name", () => {
    expect(getGreeting("Alice")).toBe("Hello, Alice!");
    expect(getGreeting("Bob")).toBe("Hello, Bob!");
  });

  test("returns guest greeting for empty name", () => {
    expect(getGreeting("")).toBe("Hello, Guest!");
    expect(getGreeting(null as any)).toBe("Hello, Guest!");
    expect(getGreeting(undefined as any)).toBe("Hello, Guest!");
  });

  test("handles whitespace-only names", () => {
    expect(getGreeting("   ")).toBe("Hello, Guest!");
  });
});

describe("formatUserName", () => {
  test("returns empty string for empty name", () => {
    expect(formatUserName("")).toBe("");
    expect(formatUserName(null as any)).toBe("");
    expect(formatUserName(undefined as any)).toBe("");
  });

  test("capitalizes first letter and lowercases rest", () => {
    expect(formatUserName("alice")).toBe("Alice");
    expect(formatUserName("BOB")).toBe("Bob");
    expect(formatUserName("jOhN")).toBe("John");
  });

  test("handles single letter names", () => {
    expect(formatUserName("a")).toBe("A");
    expect(formatUserName("Z")).toBe("Z");
  });

  test("handles names with apostrophes", () => {
    expect(formatUserName("o'brian")).toBe("O'brian");
  });
});

describe("calculateProfileCompletion", () => {
  test("returns 0 for empty profile", () => {
    const emptyUser: UserProfile = {
      name: "",
      age: 0,
      email: "",
      bio: "",
    };
    expect(calculateProfileCompletion(emptyUser)).toBe(0);
  });

  test("returns 25 for one filled field", () => {
    const partialUser: UserProfile = {
      name: "Alice",
      age: 0,
      email: "",
      bio: "",
    };
    expect(calculateProfileCompletion(partialUser)).toBe(25);
  });

  test("returns 50 for two filled fields", () => {
    const partialUser: UserProfile = {
      name: "Alice",
      age: 25,
      email: "",
      bio: "",
    };
    expect(calculateProfileCompletion(partialUser)).toBe(50);
  });

  test("returns 75 for three filled fields", () => {
    const partialUser: UserProfile = {
      name: "Alice",
      age: 25,
      email: "alice@example.com",
      bio: "",
    };
    expect(calculateProfileCompletion(partialUser)).toBe(75);
  });

  test("returns 100 for complete profile", () => {
    const completeUser: UserProfile = {
      name: "Alice",
      age: 25,
      email: "alice@example.com",
      bio: "Software Engineer",
    };
    expect(calculateProfileCompletion(completeUser)).toBe(100);
  });

  test("ignores optional fields in calculation", () => {
    const userWithRole: UserProfile = {
      name: "Alice",
      age: 25,
      email: "alice@example.com",
      bio: "",
      role: "admin",
    };
    expect(calculateProfileCompletion(userWithRole)).toBe(75); // Still 75%, role not counted
  });
});

describe("getUserRole", () => {
  test("returns 'admin' for admin role", () => {
    expect(getUserRole("admin")).toBe("admin");
  });

  test("returns 'user' for user role", () => {
    expect(getUserRole("user")).toBe("user");
  });

  test("returns 'guest' for guest role", () => {
    expect(getUserRole("guest")).toBe("guest");
  });

  test("returns 'guest' for undefined role", () => {
    expect(getUserRole(undefined)).toBe("guest");
    expect(getUserRole(null as any)).toBe("guest");
  });
});

// Component tests
describe("Profile Component", () => {
  const mockUser: UserProfile = {
    name: "alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user",
  };

  const setup = (user = mockUser) => {
    return render(<Profile user={user} />);
  };

  test("renders without crashing", () => {
    setup();
  });

  test("displays formatted user name in greeting", () => {
    setup();
    expect(screen.getByTestId("greeting")).toHaveTextContent("Hello, Alice!");
  });

  test("displays age correctly", () => {
    setup();
    expect(screen.getByText("Age: 25")).toBeInTheDocument();
  });

  test("displays profile completion percentage", () => {
    setup();
    expect(screen.getByText("Completion: 100%")).toBeInTheDocument();
  });

  test("shows bio when toggle is clicked", () => {
    setup();

    const toggleButton = screen.getByText("Show Bio");
    expect(toggleButton).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(screen.getByTestId("bio")).toHaveTextContent("Software Engineer at TechCorp.");
    expect(screen.getByText("Hide Bio")).toBeInTheDocument();
  });

  test("hides bio when toggle is clicked again", () => {
    setup();

    const toggleButton = screen.getByText("Show Bio");
    fireEvent.click(toggleButton);

    expect(screen.getByTestId("bio")).toBeInTheDocument();

    const hideButton = screen.getByText("Hide Bio");
    fireEvent.click(hideButton);

    expect(screen.queryByTestId("bio")).not.toBeInTheDocument();
    expect(screen.getByText("Show Bio")).toBeInTheDocument();
  });

  test("displays send message button", () => {
    setup();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  test("displays upgrade button", () => {
    setup();
    expect(screen.getByText("Upgrade")).toBeInTheDocument();
  });

  test("does not display premium badge initially", () => {
    setup();
    expect(screen.queryByTestId("premium-badge")).not.toBeInTheDocument();
  });

  test("displays empty status initially", () => {
    setup();
    expect(screen.getByTestId("status")).toHaveTextContent("");
  });

  test("shows 'Email not available' when sending message without email", () => {
    const userWithoutEmail = { ...mockUser, email: "" };
    setup(userWithoutEmail);

    fireEvent.click(screen.getByText("Send Message"));

    expect(screen.getByTestId("status")).toHaveTextContent("Email not available");
  });

  test("shows 'User is under 18' when sending message to minor", () => {
    const minorUser = { ...mockUser, age: 15 };
    setup(minorUser);

    fireEvent.click(screen.getByText("Send Message"));

    expect(screen.getByTestId("status")).toHaveTextContent("User is under 18");
  });

  test("shows success message when sending to adult with email", () => {
    setup();

    fireEvent.click(screen.getByText("Send Message"));

    expect(screen.getByTestId("status")).toHaveTextContent("Message sent to alice@example.com");
  });

  test("shows 'You already have admin access' for admin role upgrade", () => {
    const adminUser = { ...mockUser, role: "admin" as const };
    setup(adminUser);

    fireEvent.click(screen.getByText("Upgrade"));

    expect(screen.getByTestId("status")).toHaveTextContent("You already have admin access");
  });

  test("shows upgrade success message for user role", () => {
    setup();

    fireEvent.click(screen.getByText("Upgrade"));

    expect(screen.getByTestId("status")).toHaveTextContent("Profile upgraded to premium");
    expect(screen.getByTestId("premium-badge")).toBeInTheDocument();
  });

  test("shows 'Guests cannot be upgraded' for guest role", () => {
    const guestUser = { ...mockUser, role: "guest" as const };
    setup(guestUser);

    fireEvent.click(screen.getByText("Upgrade"));

    expect(screen.getByTestId("status")).toHaveTextContent("Guests cannot be upgraded");
  });

  test("shows 'Guests cannot be upgraded' for undefined role", () => {
    const noRoleUser = { ...mockUser, role: undefined };
    setup(noRoleUser);

    fireEvent.click(screen.getByText("Upgrade"));

    expect(screen.getByTestId("status")).toHaveTextContent("Guests cannot be upgraded");
  });

  test("displays premium badge after successful upgrade", () => {
    setup();

    fireEvent.click(screen.getByText("Upgrade"));

    expect(screen.getByTestId("premium-badge")).toHaveTextContent("⭐ Premium User");
  });

  test("handles user without bio", () => {
    const userWithoutBio = { ...mockUser, bio: undefined };
    setup(userWithoutBio);

    const toggleButton = screen.getByText("Show Bio");
    fireEvent.click(toggleButton);

    // Should not render bio section
    expect(screen.queryByTestId("bio")).not.toBeInTheDocument();
  });

  test("handles empty name gracefully", () => {
    const userWithoutName = { ...mockUser, name: "" };
    setup(userWithoutName);

    expect(screen.getByTestId("greeting")).toHaveTextContent("Hello, Guest!");
  });

  test("calculates completion correctly for partial profiles", () => {
    const partialUser = { ...mockUser, bio: "" };
    setup(partialUser);

    expect(screen.getByText("Completion: 75%")).toBeInTheDocument();
  });
});
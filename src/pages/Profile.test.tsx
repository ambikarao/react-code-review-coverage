import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Profile, {
  isAdult,
  getGreeting,
  formatUserName,
  calculateProfileCompletion,
  getUserRole
} from "./Profile";

describe("Profile Component Improved Coverage", () => {
  const baseUser = {
    name: "Alice",
    age: 25,
    email: "alice@example.com",
    bio: "Software Engineer at TechCorp.",
    role: "user" as const,
  };

  test("renders without crashing and shows correct greeting, age, and profile completion", () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Hello, Alice!");
    expect(screen.getByText(/Age:/)).toHaveTextContent("Age: 25");
    // Profile completion uses 3 filled fields (name, age, email): 3/4 * 100 = 75%
    expect(screen.getByText(/Completion:/)).toHaveTextContent("Completion: 75%");
  });

  test("shows bio toggle button and toggles bio text visibility", () => {
    render(<Profile user={baseUser} />);
    const toggleButton = screen.getByRole("button", { name: /hide bio/i });
    expect(toggleButton).toBeInTheDocument();
    // Initially bio is shown
    expect(screen.getByTestId("bio")).toHaveTextContent(baseUser.bio);

    // Click to hide bio
    fireEvent.click(toggleButton);
    expect(screen.queryByTestId("bio")).toBeNull();
    expect(screen.getByRole("button", { name: /show bio/i })).toBeInTheDocument();

    // Click to show bio again
    fireEvent.click(screen.getByRole("button", { name: /show bio/i }));
    expect(screen.getByTestId("bio")).toHaveTextContent(baseUser.bio);
  });

  test("sends message button triggers correct status for user with email", () => {
    render(<Profile user={baseUser} />);
    fireEvent.click(screen.getByText(/send message/i));
    expect(screen.getByTestId("status")).toHaveTextContent(
      `Message sent to ${baseUser.email}`
    );
  });

  test("sends message button triggers correct status if email missing and age >= 18", () => {
    const userNoEmail = { ...baseUser, email: undefined, age: 20 };
    render(<Profile user={userNoEmail} />);
    fireEvent.click(screen.getByText(/send message/i));
    expect(screen.getByTestId("status")).toHaveTextContent("User is under 18");
  });

  test("sends message button triggers correct status if email missing and age < 18", () => {
    const userNoEmailUnderage = { ...baseUser, email: undefined, age: 15 };
    render(<Profile user={userNoEmailUnderage} />);
    fireEvent.click(screen.getByText(/send message/i));
    expect(screen.getByTestId("status")).toHaveTextContent(
      `Message sent to undefined`
    );
  });

  test("update button shows correct upgrade status for admin", () => {
    const adminUser = { ...baseUser, role: "admin" };
    render(<Profile user={adminUser} />);
    fireEvent.click(screen.getByText(/update/i));
    expect(screen.getByTestId("status")).toHaveTextContent("You already have admin access");
  });

  test("update button shows correct upgrade status for user", () => {
    const normalUser = { ...baseUser, role: "user" };
    render(<Profile user={normalUser} />);
    fireEvent.click(screen.getByText(/update/i));
    expect(screen.getByTestId("status")).toHaveTextContent("Profile upgraded to premium");
  });

  test("update button shows correct upgrade status for guest", () => {
    const guestUser = { ...baseUser, role: "guest" };
    render(<Profile user={guestUser} />);
    fireEvent.click(screen.getByText(/update/i));
    expect(screen.getByTestId("status")).toHaveTextContent("Guests cannot be upgraded");
  });

  describe("Helper functions", () => {
    test("isAdult returns false if age below 18", () => {
      expect(isAdult(17)).toBe(false);
    });
    test("isAdult returns true if age 18 or above", () => {
      expect(isAdult(18)).toBe(true);
      expect(isAdult(30)).toBe(true);
    });

    test("getGreeting returns default guest greeting if name missing", () => {
      expect(getGreeting("")).toBe("Hello, Guest!");
    });
    test("getGreeting returns personalized greeting", () => {
      expect(getGreeting("Bob")).toBe("Hello, Bob!");
    });

    test("formatUserName returns empty string if no name", () => {
      expect(formatUserName("")).toBe("");
    });
    test("formatUserName formats single char name correctly", () => {
      expect(formatUserName("a")).toBe("A");
    });
    test("formatUserName formats multi-char name correctly", () => {
      expect(formatUserName("alice")).toBe("Alice");
      expect(formatUserName("ALICE")).toBe("Alice");
    });

    test("calculateProfileCompletion counts filled fields correctly", () => {
      const user1 = { name: "a", age: 20, email: "", bio: "" };
      expect(calculateProfileCompletion(user1)).toBe(50); // name + age
      const user2 = { name: "", age: 0, email: "em@em.com", bio: "b" };
      expect(calculateProfileCompletion(user2)).toBe(50); // email + bio
      const user3 = { name: "n", age: 18, email: "e@e.com", bio: "b" };
      expect(calculateProfileCompletion(user3)).toBe(100); // all 4
    });

    test("getUserRole returns 'guest' if role missing/undefined", () => {
      expect(getUserRole(undefined)).toBe("guest");
    });
    test("getUserRole returns correct role string", () => {
      expect(getUserRole("admin")).toBe("admin");
      expect(getUserRole("user")).toBe("user");
      expect(getUserRole("guest")).toBe("guest");
    });
  });
});
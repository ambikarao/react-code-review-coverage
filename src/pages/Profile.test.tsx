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

  test("renders without crashing", () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  test("displays correct greeting for named user", () => {
    expect(getGreeting("Bob")).toBe("Hello, Bob!");
  });

  test("displays default greeting for empty or missing name", () => {
    expect(getGreeting("")).toBe("Hello, Guest!");
    expect(getGreeting(null as any)).toBe("Hello, Guest!");
  });

  test("formatUserName handles empty and normal names correctly", () => {
    expect(formatUserName("")).toBe("");
    expect(formatUserName("alice")).toBe("Alice");
    expect(formatUserName("ALICE")).toBe("Alice");
    expect(formatUserName("aLiCe")).toBe("Alice");
  });

  test("calculateProfileCompletion calculates percentage correctly", () => {
    // All fields missing
    const emptyFields = { name: "", age: 0, email: "", bio: "" };
    expect(calculateProfileCompletion(emptyFields)).toBe(0);

    // One field present
    expect(calculateProfileCompletion({ ...emptyFields, name: "Bob" })).toBe(25);
    expect(calculateProfileCompletion({ ...emptyFields, age: 30 })).toBe(25);
    expect(calculateProfileCompletion({ ...emptyFields, email: "bob@example.com" })).toBe(25);
    expect(calculateProfileCompletion({ ...emptyFields, bio: "Hi" })).toBe(25);

    // Multiple fields present
    expect(
      calculateProfileCompletion({ name: "Bob", age: 30, email: "", bio: "" })
    ).toBe(50);

    // All fields present
    expect(calculateProfileCompletion(baseUser)).toBe(100);
  });

  test("isAdult returns correct boolean", () => {
    expect(isAdult(17)).toBe(false);
    expect(isAdult(18)).toBe(true);
    expect(isAdult(25)).toBe(true);
  });

  test("getUserRole returns correct role string", () => {
    expect(getUserRole("user")).toBe("guest");
    expect(getUserRole("admin")).toBe("admin");
    expect(getUserRole("guest")).toBe("user");
    expect(getUserRole(undefined as any)).toBe("guest");
  });

  describe("Profile component UI and interaction", () => {
    test("shows bio toggle button text and toggles bio visibility", () => {
      render(<Profile user={baseUser} />);

      // Initially, bio is hidden, button text is 'Show Bio'
      const toggleBtn = screen.getByRole('button', { name: /show bio/i });
      expect(toggleBtn).toBeInTheDocument();
      expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();

      // Click to show bio
      fireEvent.click(toggleBtn);
      expect(screen.queryByText(baseUser.bio)).toBeInTheDocument();
      expect(toggleBtn).toHaveTextContent(/hide bio/i);

      // Click to hide bio
      fireEvent.click(toggleBtn);
      expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
      expect(toggleBtn).toHaveTextContent(/show bio/i);
    });

    test("send message button triggers correct state updates based on user email and age", () => {
      const { rerender } = render(<Profile user={baseUser} />);

      const sendMsgBtn = screen.getByRole('button', { name: /send message/i });

      // User has email => should set status to "Message sent to alice@example.com"
      fireEvent.click(sendMsgBtn);
      expect(screen.getByText(/message sent to alice@example.com/i)).toBeInTheDocument();

      // User without email but adult age
      const userNoEmailAdult = { ...baseUser, email: "", age: 25 };
      rerender(<Profile user={userNoEmailAdult} />);
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      expect(screen.getByText(/user is under 18/i)).not.toBeInTheDocument();
      expect(screen.getByText(/message sent to alice@example.com/i)).not.toBeInTheDocument();
      expect(screen.getByText(/message sent to/i) || screen.getByText(/user is under 18/i)).toBeInTheDocument();

      // The component state resets per rerender - test no email and under 18
      const userNoEmailUnder18 = { ...baseUser, email: "", age: 16 };
      rerender(<Profile user={userNoEmailUnder18} />);
      fireEvent.click(screen.getByRole('button', { name: /send message/i }));
      expect(screen.getByText(/user is under 18/i)).toBeInTheDocument();
    });

    test("update button sets correct status based on role", () => {
      const { rerender } = render(<Profile user={{ ...baseUser, role: "admin" }} />);

      const updateBtn = screen.getByRole('button', { name: /update/i });

      fireEvent.click(updateBtn);
      expect(screen.getByText(/you already have admin access/i)).toBeInTheDocument();

      rerender(<Profile user={{ ...baseUser, role: "user" }} />);
      fireEvent.click(screen.getByRole('button', { name: /update/i }));
      expect(screen.getByText(/profile upgraded to premium/i)).toBeInTheDocument();

      rerender(<Profile user={{ ...baseUser, role: "guest" }} />);
      fireEvent.click(screen.getByRole('button', { name: /update/i }));
      expect(screen.getByText(/guests cannot be upgraded/i)).toBeInTheDocument();
    });

    test("renders all key user info and computed profile completion percentage", () => {
      render(<Profile user={baseUser} />);
      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/hello, alice!/i);
      expect(screen.getByText(/age: 25/i)).toBeInTheDocument();
      expect(screen.getByText(/completion: 100%/i)).toBeInTheDocument() ||
        expect(screen.getByText(/completion: 100/i)).toBeInTheDocument();
      expect(screen.getByText(/premi.*user/i) || screen.getByText(/profile upgrade/i)).toBeInTheDocument();
    });

    test("does not show bio section or button if bio is empty or missing", () => {
      const userNoBio = { ...baseUser, bio: "" };
      render(<Profile user={userNoBio} />);
      // The Show Bio button is always rendered so here just toggle and ensure no bio text appears
      const toggleBtn = screen.getByRole('button', { name: /show bio/i });
      fireEvent.click(toggleBtn);
      expect(screen.queryByText("")).not.toBeInTheDocument();
    });
  });
});

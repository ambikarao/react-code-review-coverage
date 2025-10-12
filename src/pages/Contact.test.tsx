// Contact.test.tsx
import { validateEmail } from "./Contact";

describe("validateEmail", () => {
  test("returns true for a valid email", () => {
    expect(validateEmail("user@example.com")).toBe(true);
  });

  test("returns false for an invalid email", () => {
    expect(validateEmail("invalid-email")).toBe(false);
  });
});

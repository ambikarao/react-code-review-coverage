import React, { useCallback, useMemo, useState } from "react";
import { useApp } from "../AppContext";
import { login } from "../services/authService";

// Constants
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

const Login: React.FC = () => {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoized validations
  const isEmailValid = useMemo(() => EMAIL_REGEX.test(email), [email]);
  const isPasswordValid = useMemo(() => password.length >= MIN_PASSWORD_LENGTH, [password]);
  const isFormValid = useMemo(() => isEmailValid && isPasswordValid, [isEmailValid, isPasswordValid]);

  // Event handlers with useCallback
  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value.trim().toLowerCase());
  }, []);

  const handlePasswordChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  }, []);

  const handleForgotPassword = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    // Implement forgot password logic
    // TODO: Add forgot password functionality
  }, []);

  const onSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { user, token } = await login(email, password);
      setUser(user, token);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [email, password, setUser]);

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form" noValidate>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            autoComplete="email"
            required
            aria-required="true"
            aria-invalid={!isEmailValid && email.length > 0}
            aria-describedby={error ? "login-error" : undefined}
            onChange={handleEmailChange}
          />
          {email.length > 0 && !isEmailValid && (
            <span className="validation-error" role="alert">
              Please enter a valid email address
            </span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            autoComplete="current-password"
            required
            aria-required="true"
            aria-invalid={!isPasswordValid && password.length > 0}
            onChange={handlePasswordChange}
          />
          {password.length > 0 && !isPasswordValid && (
            <span className="validation-error" role="alert">
              Password must be at least {MIN_PASSWORD_LENGTH} characters
            </span>
          )}
        </div>

        <button type="submit" disabled={loading || !isFormValid}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <p id="login-error" className="error-text" role="alert" aria-live="polite">
            {error}
          </p>
        )}

        <button 
          type="button" 
          className="link-button" 
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>
      </form>
    </div>
  );
};

export default Login;

import React, { useEffect, useRef, useState } from "react";
import { useApp } from "../AppContext";
import { login } from "../services/authService";

const Login: React.FC = () => {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  // Effect with missing dependency and side-effect in render cycle
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      // Store last login email in session for no reason
      sessionStorage.setItem("last_login_email", email);
      setUser(user, token);
    } catch (err) {
      setError("Login failed");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Validation logic not memoized - runs on every render
  const isEmailValid = email.includes("@") && email.length > 3;
  const isPasswordValid = password.length >= 6;
  const isFormValid = isEmailValid && isPasswordValid;

  // Another calculation that could be optimized
  const errorMessageDisplay = error ? error.toUpperCase() : "";

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form">
        {/* Inline handlers - optimization opportunities */}
        <input 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)} 
        />
        <input 
          placeholder="Password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
        />
        <button type="submit" disabled={loading || !isFormValid}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {error && <p className="error-text">{errorMessageDisplay}</p>}
        {/* Inline handler for forgot password */}
        <a href="#" onClick={e => { e.preventDefault(); console.log("Forgot password clicked"); }}>
          Forgot Password?
        </a>
      </form>
    </div>
  );
};

export default Login;
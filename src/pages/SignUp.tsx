import React, { useCallback, useState } from "react";
import { useApp } from "../AppContext";
import { signUp } from "../services/authService";

const SignUp: React.FC = () => {
  const { setUser } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await signUp(name, email, password);
      setUser(user, token);
    } catch (err) {
      setError("Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  // Password strength calculation not memoized
  const passwordStrength = password.length < 6 
    ? "weak" 
    : password.length < 10 
    ? "medium" 
    : "strong";
  
  const passwordStrengthColor = passwordStrength === "weak" 
    ? "red" 
    : passwordStrength === "medium" 
    ? "orange" 
    : "green";

  // Form validation recalculated on every render
  const isNameValid = name.trim().length > 0;
  const isEmailValid = email.includes("@");
  const isPasswordValid = password.length >= 6;
  const canSubmit = isNameValid && isEmailValid && isPasswordValid && !loading;

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit} className="auth-form">
        {/* Inline handlers - optimization opportunities */}
        <input 
          placeholder="Name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
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
        {password.length > 0 && (
          <div style={{ color: passwordStrengthColor }}>
            Password strength: {passwordStrength}
          </div>
        )}
        <button type="submit" disabled={!canSubmit}>
          {loading ? "Creating..." : "Create account"}
        </button>
        {error && <p className="error-text">{error}</p>}
        {/* Inline handler - optimization opportunity */}
        <p>
          Already have an account? 
          <a href="#" onClick={(e) => { e.preventDefault(); console.log("Login clicked"); }}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
import React, { useState } from "react";
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

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default SignUp;



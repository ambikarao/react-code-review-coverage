import React, { useState } from "react";
import { useApp } from "../AppContext";
import { login } from "../services/authService";

const Login: React.FC = () => {
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { user, token } = await login(email, password);
      setUser(user, token);
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
};

export default Login;



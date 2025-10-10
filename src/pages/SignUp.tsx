import React, { useCallback, useState, useMemo } from 'react';
import { useApp } from '../AppContext';
import { signUp } from '../services/authService';

const SignUp: React.FC = () => {
  const { setUser } = useApp();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
      setError('Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = useCallback((e) => setName(e.target.value), []);
  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  const passwordStrength = useMemo(() => password.length < 6 ? 'weak' : password.length < 10 ? 'medium' : 'strong', [password]);
  const passwordStrengthColor = passwordStrength === 'weak' ? 'red' : passwordStrength === 'medium' ? 'orange' : 'green';

  const isValid = (value: string) => value.trim().length > 0;
  const isNameValid = isValid(name);
  const isEmailValid = email.includes('@');
  const isPasswordValid = password.length >= 6;
  const canSubmit = isNameValid && isEmailValid && isPasswordValid && !loading;

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={onSubmit} className="auth-form">
        <input placeholder="Name" value={name} onChange={handleNameChange} />
        <input placeholder="Email" value={email} onChange={handleEmailChange} />
        <input placeholder="Password" type="password" value={password} onChange={handlePasswordChange} />
        {password.length > 0 && (
          <div style={{ color: passwordStrengthColor }}>
            Password strength: {passwordStrength}
          </div>
        )}
        <button type="submit" disabled={!canSubmit}>
          {loading ? 'Creating...' : 'Create account'}
        </button>
        {error && <p className="error-text">{error}</p>}
        <p>
          Already have an account? 
          <a href="#" onClick={(e) => { e.preventDefault(); /* Remove console.log */ }}>
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
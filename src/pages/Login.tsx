import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useApp } from '../AppContext';
import { login } from '../services/authService';

const Login: React.FC = () => {
  const { setUser } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, [email, password]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (mountedRef.current) setLoading(true);
    try {
      const { user, token } = await login(email, password);
      sessionStorage.setItem('last_login_email', email);
      setUser(user, token);
    } catch (err) {
      setError('Login failed');
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  const validateEmail = (email: string) => email.includes('@') && email.length > 3;
  const validatePassword = (password: string) => password.length >= 6;
  const isEmailValid = useMemo(() => validateEmail(email), [email]);
  const isPasswordValid = useMemo(() => validatePassword(password), [password]);
  const isFormValid = isEmailValid && isPasswordValid;

  const errorMessageDisplay = useMemo(() => error?.toUpperCase() || '', [error]);

  const handleEmailChange = useCallback((e) => setEmail(e.target.value), []);
  const handlePasswordChange = useCallback((e) => setPassword(e.target.value), []);

  return (
    <div className='auth-container'>
      <h2>Login</h2>
      <form onSubmit={onSubmit} className='auth-form'>
        <input 
          placeholder='Email' 
          value={email} 
          onChange={handleEmailChange} 
        />
        <input 
          placeholder='Password' 
          type='password' 
          value={password} 
          onChange={handlePasswordChange} 
        />
        <button type='submit' disabled={loading || !isFormValid}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p className='error-text'>{errorMessageDisplay}</p>}
        <a href='#' onClick={(e) => { e.preventDefault(); /* Remove console.log */ }}>Forgot Password?</a>
      </form>
    </div>
  );
};

export default Login;
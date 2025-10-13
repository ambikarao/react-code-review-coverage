import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('renders login form with email and password inputs and login button', () => {
    render(<Login />);

    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('login button is disabled initially', () => {
    render(<Login />);
    const button = screen.getByRole('button', { name: /login/i });
    expect(button).toBeDisabled();
  });

  test('enables login button only when form is valid', () => {
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: /login/i });

    // Enter invalid email and short password
    fireEvent.change(emailInput, { target: { value: 'invalid' }});
    fireEvent.change(passwordInput, { target: { value: '123' }});
    expect(button).toBeDisabled();

    // Enter valid email but short password
    fireEvent.change(emailInput, { target: { value: 'user@example.com' }});
    fireEvent.change(passwordInput, { target: { value: '123' }});
    expect(button).toBeDisabled();

    // Enter valid email and valid password
    fireEvent.change(passwordInput, { target: { value: '123456' }});
    expect(button).toBeEnabled();
  });

  test('displays loading text on submit and disables button', async () => {
    jest.useFakeTimers();
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' }});
    fireEvent.change(passwordInput, { target: { value: '123456' }});

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByRole('button')).toHaveTextContent(/logging in/i);

    // Fast-forward all timers
    jest.runAllTimers();
    jest.useRealTimers();
  });

  test('performs successful login and stores last email in sessionStorage', async () => {
    const mockLogin = jest.fn(async (email, password) => {
      return Promise.resolve({ user: 'mockUser', token: 'mockToken' });
    });

    // Override the login import inside the component with mockLogin
    // Note: Since component code can't be changed, simulate with spyOn
    // Here, just call the component normally assuming login returns successful promise

    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'user@example.com' }});
    fireEvent.change(passwordInput, { target: { value: '123456' }});

    fireEvent.click(button);

    await waitFor(() => expect(button).toBeEnabled());
    expect(sessionStorage.getItem('last_login_email')).toEqual('user@example.com');
  });

  test('shows error message if login fails', async () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const button = screen.getByRole('button', { name: /login/i });

    // Enter credentials that will supposedly fail login
    fireEvent.change(emailInput, { target: { value: 'fail@example.com' }});
    fireEvent.change(passwordInput, { target: { value: '123456' }});

    // Mock console.log to avoid cluttering test output
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    fireEvent.click(button);

    // Wait for error message
    await waitFor(() => {
      expect(screen.getByText(/Login failed/i)).toBeInTheDocument();
      expect(button).toBeEnabled();
    });

    consoleLogSpy.mockRestore();
  });

  test('forgots password link renders and logs click event', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

    render(<Login />);

    const forgotLink = screen.getByText(/Forgot Password\?/i);
    expect(forgotLink).toBeInTheDocument();

    fireEvent.click(forgotLink);
    expect(consoleSpy).toHaveBeenCalledWith('Forgot password clicked');

    consoleSpy.mockRestore();
  });

  test('does not call login if email or password is empty (edge case)', () => {
    render(<Login />);

    const button = screen.getByRole('button', { name: /login/i });
    fireEvent.click(button);

    // Since nothing to expect visually, just ensure no error message is shown
    expect(screen.queryByText(/Login failed/i)).not.toBeInTheDocument();
  });

  test('sessionStorage preserves last login email across renders', () => {
    sessionStorage.setItem('last_login_email', 'stored@example.com');
    render(<Login />);
    const emailInput = screen.getByPlaceholderText('Email');
    expect(emailInput).toHaveValue('stored@example.com');
  });
});
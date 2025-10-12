import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm, { validateEmail, sendMessage } from './Contact';

describe('validateEmail', () => {
  test('returns true for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('returns false for an invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});

describe('sendMessage', () => {
  test('returns Invalid email if email is invalid', () => {
    expect(sendMessage({ name: 'Test', email: 'bademail', message: 'Hello' })).toBe('Invalid email');
  });

  test('returns Message cannot be empty if message is empty', () => {
    expect(sendMessage({ name: 'Test', email: 'test@example.com', message: ' ' })).toBe('Message cannot be empty');
  });

  test('returns sent message string if input is valid', () => {
    expect(sendMessage({ name: 'John', email: 'john@example.com', message: 'Hi there' })).toBe('Message sent to John');
  });
});

describe('ContactForm Component', () => {
  test('renders the form and inputs correctly', () => {
    render(<ContactForm />);
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('typing in inputs updates form state', () => {
    render(<ContactForm />);
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByPlaceholderText(/message/i);

    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    expect(nameInput).toHaveValue('Alice');

    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    expect(emailInput).toHaveValue('alice@example.com');

    fireEvent.change(messageInput, { target: { value: 'Hello!' } });
    expect(messageInput).toHaveValue('Hello!');
  });

  test('shows validation message for invalid email on submit', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'bob_at_example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/message/i), { target: { value: 'Hi' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByTestId('status')).toHaveTextContent('Invalid email');
  });

  test('shows validation message for empty message on submit', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'bob@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/message/i), { target: { value: '' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByTestId('status')).toHaveTextContent('Message cannot be empty');
  });

  test('shows success message on valid submit', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Carol' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'carol@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/message/i), { target: { value: 'Hello there' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByTestId('status')).toHaveTextContent('Message sent to Carol');
  });

  test('form resets message input after submit', () => {
    render(<ContactForm />);
    const messageInput = screen.getByPlaceholderText(/message/i);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Dave' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'dave@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(messageInput).toHaveValue('');
  });
});
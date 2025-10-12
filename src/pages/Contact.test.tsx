import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm, { validateEmail, sendMessage } from './Contact';

// Tests for validateEmail function
describe('validateEmail', () => {
  test('returns true for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('returns false for an invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});

// Tests for sendMessage function
describe('sendMessage', () => {
  test('returns "Invalid email" if email is invalid', () => {
    expect(sendMessage({ name: 'John', email: 'bademail', message: 'Hello' })).toBe('Invalid email');
  });

  test('returns "Message cannot be empty" if message is empty', () => {
    expect(sendMessage({ name: 'John', email: 'john@example.com', message: '' })).toBe('Message cannot be empty');
  });

  test('returns correct sent message string for valid input', () => {
    expect(sendMessage({ name: 'Jane', email: 'jane@example.com', message: 'Hi there' })).toBe('Message sent to Jane');
  });
});

// Integration / Component tests
describe('ContactForm Component', () => {
  test('renders form fields and initial empty values', () => {
    render(<ContactForm />);
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('');
    expect(screen.getByLabelText(/Message/i)).toHaveValue('');
  });

  test('updates form fields on user input', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Alice' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'alice@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Test message' } });
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Alice');
    expect(screen.getByLabelText(/Email/i)).toHaveValue('alice@example.com');
    expect(screen.getByLabelText(/Message/i)).toHaveValue('Test message');
  });

  test('shows error message on submit with invalid email', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'bob-at-example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Hello' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByTestId('status')).toHaveTextContent('Invalid email');
  });

  test('shows error message on submit with empty message', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Carl' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'carl@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByTestId('status')).toHaveTextContent('Message cannot be empty');
  });

  test('shows success message on submit with valid data', () => {
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'Valid message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(screen.getByTestId('status')).toHaveTextContent('Message sent to Dana');
  });
});

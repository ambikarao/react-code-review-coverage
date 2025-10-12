import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ContactForm, { validateEmail, sendMessage } from './Contact';

// Tests for validateEmail util
describe('validateEmail', () => {
  test('returns true for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('returns false for an invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});

// Mock sendMessage function to simulate async operation
jest.mock('./Contact', () => {
  const originalModule = jest.requireActual('./Contact');
  return {
    __esModule: true,
    ...originalModule,
    sendMessage: jest.fn((contact) => {
      if (!originalModule.validateEmail(contact.email)) {
        return 'Invalid email';
      }
      if (!contact.message.trim()) {
        return 'Message cannot be empty';
      }
      return `Message sent to ${contact.name}`;
    }),
  };
});

describe('ContactForm Component', () => {
  beforeEach(() => {
    render(<ContactForm />);
  });

  test('renders form inputs and heading', () => {
    expect(screen.getByRole('heading', { name: /contact us/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Message')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });

  test('updates input values on change', () => {
    const nameInput = screen.getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'Alice' } });
    expect(nameInput.value).toBe('Alice');

    const emailInput = screen.getByPlaceholderText('Email');
    fireEvent.change(emailInput, { target: { value: 'alice@example.com' } });
    expect(emailInput.value).toBe('alice@example.com');

    const messageTextarea = screen.getByPlaceholderText('Message');
    fireEvent.change(messageTextarea, { target: { value: 'Hello!' } });
    expect(messageTextarea.value).toBe('Hello!');
  });

  test('shows invalid email message when email is invalid on submit', () => {
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Bob' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Testing message' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  test('shows message cannot be empty when message is empty on submit', () => {
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Charlie' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'charlie@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: ' ' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText(/message cannot be empty/i)).toBeInTheDocument();
  });

  test('shows success message when form is valid and submitted', () => {
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Dana' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'dana@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Hello from Dana!' } });

    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    expect(screen.getByText(/message sent to dana/i)).toBeInTheDocument();
  });

  test('clears message input after successful send', () => {
    const messageInput = screen.getByPlaceholderText('Message');
    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Eve' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'eve@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));

    // After sending, message input should be cleared as per component logic
    expect(messageInput.value).toBe('');
  });

  test('status element updates correctly for each submit', () => {
    const statusElement = screen.getByTestId('status');

    fireEvent.change(screen.getByPlaceholderText('Name'), { target: { value: 'Frank' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'frank@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: 'Message 1' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(statusElement).toHaveTextContent(/message sent to frank/i);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'wrongemail' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(statusElement).toHaveTextContent(/invalid email/i);

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'frank@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Message'), { target: { value: ' ' } });
    fireEvent.click(screen.getByRole('button', { name: /send/i }));
    expect(statusElement).toHaveTextContent(/message cannot be empty/i);
  });
});
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile, {
  isAdult,
  getGreeting,
  formatUserName,
  calculateProfileCompletion,
  getUserRole
} from './Profile';

describe('Profile Component', () => {
  const baseUser = {
    name: 'alice',
    age: 25,
    email: 'alice@example.com',
    bio: 'Software Engineer at TechCorp.',
    role: 'user' as const
  };

  test('renders greeting with formatted name', () => {
    render(<Profile user={baseUser} />);
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toHaveTextContent('Hello, aLIce!');
  });

  test('displays user age and profile completion', () => {
    render(<Profile user={baseUser} />);
    expect(screen.getByText(/Age:/i)).toHaveTextContent(`Age: ${baseUser.age}`);
    // Profile completion calculation = (4 fields filled of 4) => 100
    expect(screen.getByText(/Completion:/i)).toHaveTextContent('Completion: 100%');
  });

  test('toggle bio show/hide button works', () => {
    render(<Profile user={baseUser} />);
    const toggleBtn = screen.getByRole('button', { name: /show bio/i });
    expect(toggleBtn).toBeInTheDocument();
    // initially bio is hidden
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();

    // click to show bio
    fireEvent.click(toggleBtn);
    expect(screen.getByRole('button', { name: /hide bio/i })).toBeInTheDocument();
    expect(screen.getByText(baseUser.bio)).toBeInTheDocument();

    // click again to hide bio
    fireEvent.click(screen.getByRole('button', { name: /hide bio/i }));
    expect(screen.queryByText(baseUser.bio)).not.toBeInTheDocument();
  });

  test('send message button sets status correctly when email missing', () => {
    const userNoEmail = { ...baseUser, email: '' };
    render(<Profile user={userNoEmail} />);
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);
    expect(screen.getByText(/Email not available/i)).toBeInTheDocument();
  });

  test('send message button sets status correctly when user is under 18', () => {
    const underageUser = { ...baseUser, age: 15, email: 'young@example.com' };
    render(<Profile user={underageUser} />);
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);
    expect(screen.getByText(/User is under 18/i)).toBeInTheDocument();
  });

  test('send message button sets status correctly when user is adult with email', () => {
    render(<Profile user={baseUser} />);
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);
    expect(screen.getByText(new RegExp(`Message sent to ${baseUser.email}`, 'i'))).toBeInTheDocument();
  });

  test('update button sets status correctly based on role', () => {
    const adminUser = { ...baseUser, role: 'admin' };
    const userUser = { ...baseUser, role: 'user' };
    const guestUser = { ...baseUser, role: 'guest' };

    // Admin
    const { getByRole, unmount } = render(<Profile user={adminUser} />);
    fireEvent.click(getByRole('button', { name: /update/i }));
    expect(screen.getByText(/You already have admin access/i)).toBeInTheDocument();

    // User
    unmount();
    render(<Profile user={userUser} />);
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(screen.getByText(/Profile upgraded to premium/i)).toBeInTheDocument();

    // Guest
    unmount();
    render(<Profile user={guestUser} />);
    fireEvent.click(screen.getByRole('button', { name: /update/i }));
    expect(screen.getByText(/Guests cannot be upgraded/i)).toBeInTheDocument();
  });

  test('calculateProfileCompletion calculates correctly for partial fields', () => {
    const partialUser = { name: '', age: 0, email: '', bio: '', role: 'guest' };
    expect(calculateProfileCompletion(partialUser)).toBe(0);
    const halfUser = { name: 'bob', age: 20, email: '', bio: '', role: 'user' };
    expect(calculateProfileCompletion(halfUser)).toBe(50); // 2 out of 4
  });

  test('isAdult returns correct boolean for edge cases', () => {
    expect(isAdult(17)).toBe(false);
    expect(isAdult(18)).toBe(true);
  });

  test('getGreeting returns correct greetings with empty or missing name', () => {
    expect(getGreeting('')).toBe('Hello, Guest!');
    expect(getGreeting(null as unknown as string)).toBe('Hello, Guest!');
    expect(getGreeting('Bob')).toBe('Hello, Bob!');
  });

  test('formatUserName returns correctly formatted names', () => {
    expect(formatUserName('')).toBe('');
    expect(formatUserName(null as unknown as string)).toBe('');
    expect(formatUserName('bob')).toBe('BoB');
    expect(formatUserName('ALICE')).toBe('ALICE');
  });

  test('getUserRole returns expected role string for invalid and valid roles', () => {
    expect(getUserRole(undefined as unknown as string)).toBe('guest');
    expect(getUserRole('admin')).toBe('admin');
    expect(getUserRole('user')).toBe('user');
    expect(getUserRole('guest')).toBe('guest');
  });
});

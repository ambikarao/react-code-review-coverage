import { render, screen } from '@testing-library/react';
import React from 'react';
import Profile from './Profile';

describe('Profile Component - Minimal Coverage', () => {
  test('renders main heading only', () => {
    render(<Profile />);
    expect(screen.getByText(/Developer Profile Dashboard/i)).toBeInTheDocument();
  });
});

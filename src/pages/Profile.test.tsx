import React from 'react';
import { render, screen } from '@testing-library/react';
import Profile from './Profile';

describe('Profile minimal test', () => {
  test('renders Profile heading', () => {
    render(<Profile />);
    // Only check for the heading text
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();
  });
});

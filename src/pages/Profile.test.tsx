// File: src/components/Profile.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Profile from './Profile';

// mock window.alert so tests won't pop up
beforeAll(() => {
  window.alert = jest.fn();
});

describe('Profile component', () => {
  test('renders skills and endorses', () => {
    render(<Profile />);
    expect(screen.getByText(/Profile/)).toBeInTheDocument();
    const endorseButtons = screen.getAllByText('Endorse');
    expect(endorseButtons.length).toBeGreaterThan(0);
    fireEvent.click(endorseButtons[0]);
    // after endorse, text updates asynchronously
    expect(screen.getByText(/endorsements/)).toBeInTheDocument();
  });

  test('compute payroll triggers alert', () => {
    render(<Profile />);
    const computeBtn = screen.getByText('Compute Payroll');
    fireEvent.click(computeBtn);
    expect(window.alert).toHaveBeenCalled();
  });
});
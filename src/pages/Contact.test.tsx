import { render, screen } from '@testing-library/react';
import React from 'react';
import Contact from './Contact';

describe('Contact Component - Very Minimal Coverage', () => {
  test('renders heading only', () => {
    render(<Contact />);
    expect(screen.getByText(/Contact — Messages/i)).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import Contact from './Contact';

describe('Contact component minimal test', () => {
  test('renders Contact heading', () => {
    render(<Contact />);
    // only verify that heading text appears
    expect(screen.getByText(/Contact — Messages/i)).toBeInTheDocument();
  });
});

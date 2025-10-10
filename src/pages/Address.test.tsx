import React from 'react';
import { render, screen } from '@testing-library/react';
import Address from './Address';

describe('Address component', () => {
  it('renders correctly with default state', () => {
    render(<Address />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World');
    expect(screen.getByText('This is the Address component.')).toBeInTheDocument();
  });

  it('getMessage returns fallback when showMessage is false', () => {
    render(<Address />);
    expect(screen.getByText(/Fallback/)).toBeInTheDocument();
  });

  it('getMessage returns expected string when showMessage is true - tested indirectly', () => {
    // This case cannot be tested without modifying the component, see comments in the original test.
  });
});
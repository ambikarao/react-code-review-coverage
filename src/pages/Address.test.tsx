import React from 'react';
import { render, screen } from '@testing-library/react';
import Address from './Address';

describe('Address component', () => {
  it('renders correctly with default state', () => {
    render(<Address />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World');
    expect(screen.getByText('This is the Address component.')).toBeInTheDocument();
  });

  it('shows fallback message when showMessage is false', () => {
    render(<Address />);
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  it('gets message as fallback string when showMessage is false by inspecting the text content', () => {
    render(<Address />);
    // Since showMessage is false, getMessage returns 'Fallback', assert text includes it
    expect(screen.getByText(/Fallback/)).toBeInTheDocument();
  });
});

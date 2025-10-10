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
    render(<Address showMessage={false} />);
    expect(screen.getByText(/Fallback/)).toBeInTheDocument();
  });

  it('getMessage returns expected string when showMessage is true', () => {
    render(<Address showMessage={true} />);
    expect(screen.getByText('This line is never executed in default.')).toBeInTheDocument();
  });

  it('renders the component with data-testid attribute', () => {
    render(<Address />);
    expect(screen.getByTestId('address-component')).toBeInTheDocument();
  });
});

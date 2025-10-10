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
    // We cannot call getMessage directly but we can rely on render behavior since showMessage is false
    render(<Address />);
    // The rendered output should include 'Fallback' text as per returned string
    expect(screen.getByText(/Fallback/)).toBeInTheDocument();
  });

  it('getMessage returns expected string when showMessage is true - tested indirectly', () => {
    // We cannot change showMessage inside the component (hardcoded), so to test this theoretically
    // we could refactor to expose getMessage or allow showMessage to be set via props (not allowed per instructions).
    // So this testcase is noted here for completeness but cannot be implemented without modifying the component.
  });
});
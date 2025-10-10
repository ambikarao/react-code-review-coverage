import { render, screen } from '@testing-library/react';
import React from 'react';
import Address from './Address'; // Assuming the component is in the same directory

describe('Address Component', () => {
  test('renders the Address component with correct headings and paragraphs', () => {
    render(<Address />);

    const addressWrapper = screen.getByTestId('address-component');
    expect(addressWrapper).toBeInTheDocument();

    const headingElement = screen.getByRole('heading', { level: 1, name: /Hello World/i });
    expect(headingElement).toBeInTheDocument();

    const paragraphElement = screen.getByText(/This is the Address component./i);
    expect(paragraphElement).toBeInTheDocument();
  });

  test('renders the fallback message from getMessage function', () => {
    // The getMessage function returns "Fallback" when showMessage is false
    render(<Address />);
    expect(screen.getByText('Fallback')).toBeInTheDocument();
  });

  test('the component renders the expected static output regardless of the unused logic', () => {
    render(<Address />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });
});

/*
* NOTE: For these tests to run, you need to ensure you have:
* - @testing-library/react
* - @testing-library/jest-dom (for toBeInTheDocument(), etc.)
* installed in your project.
*/

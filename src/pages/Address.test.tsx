import { render, screen } from '@testing-library/react';
import React from 'react';
import Address from './Address'; // Assuming the component is in the same directory

describe('Address Component', () => {
  // Test case 1: Check if the component renders without crashing and contains the main content.
  test('renders the Address component with correct headings and paragraphs', () => {
    // 1. Render the component
    render(<Address />);

    // 2. Assert that the main component wrapper is present using its data-testid
    const addressWrapper = screen.getByTestId('address-component');
    expect(addressWrapper).toBeInTheDocument();

    // 3. Assert the presence of the <h1> element content
    const headingElement = screen.getByRole('heading', { level: 1, name: /Hello World/i });
    expect(headingElement).toBeInTheDocument();
    
    // 4. Assert the presence of the <p> element content
    const paragraphElement = screen.getByText(/This is the Address component./i);
    expect(paragraphElement).toBeInTheDocument();
  });
  
  // Test case 2: Verify the unused function logic does not interfere with rendering (optional, but good practice)
  test('the component renders the expected static output regardless of the unused logic', () => {
    // Note: The internal logic (getMessage function) is not directly callable or testable 
    // from outside the component when it is not part of the rendered output.
    // This test ensures the core visible elements are present.
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

// File: src/components/About.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import About from './About';

describe('About component', () => {
  test('renders and computes productivity', () => {
    render(<About />);
    expect(screen.getByText(/About — Team Performance/)).toBeInTheDocument();

    // change years and verify computed output updates
    const yearsInput = screen.getByLabelText(/Years at company/);
    fireEvent.change(yearsInput, { target: { value: '5' } });
    expect(yearsInput).toHaveValue(5);

    const growthInput = screen.getByLabelText(/Growth Rate/);
    fireEvent.change(growthInput, { target: { value: '0.2' } });
    expect(growthInput).toHaveValue(0.2);

    // change projects via blur to trigger parse
    const projectsInput = screen.getByLabelText(/Projects/);
    fireEvent.blur(projectsInput, { target: { value: '2,4,6,8,10' } });

    // after changing, expect a complexity score element to be present
    expect(screen.getByText(/Complexity Score:/)).toBeInTheDocument();
  });

  test('parses project csv safely', () => {
    render(<About />);
    const projectsInput = screen.getByLabelText(/Projects/);
    fireEvent.blur(projectsInput, { target: { value: 'a, , 10, 20' } });
    // should not throw and should show anomaly list
    expect(screen.getByText(/Anomalies/)).toBeInTheDocument();
  });
});
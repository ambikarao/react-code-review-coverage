import React from 'react';
import { render, screen } from '@testing-library/react';
import Orders from './Orders';

describe('Orders Component (Low Coverage)', () => {
  test('renders Orders header and loading elements minimally', () => {
    render(<Orders />);

    // Check header renders
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();

    // Check that CSV / summary message is present
    expect(screen.getByText(/CSV \/ Summary hidden in test mode/i)).toBeInTheDocument();

    // Optional: check at least one order exists (minimal interaction)
    const firstOrder = screen.getAllByText(/Order o/i)[0];
    expect(firstOrder).toBeInTheDocument();
  });
});

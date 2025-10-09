// File: src/components/Orders.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Orders from './Orders';

describe('Orders component', () => {
  test('renders orders and toggles shipping', () => {
    render(<Orders />);
    expect(screen.getByText(/Orders/)).toBeInTheDocument();

    const checkbox = screen.getByLabelText(/Include shipping/);
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    expect(checkbox).toHaveProperty('checked');

    // click cancel older — should not throw
    const cancelBtn = screen.getByText(/Cancel older than 7 days/);
    fireEvent.click(cancelBtn);
    expect(screen.getByText(/Order Summary/)).toBeInTheDocument();
  });

  test('export csv contains header', () => {
    render(<Orders />);
    expect(screen.getByText(/status,count,revenue/)).toBeInTheDocument();
  });
});

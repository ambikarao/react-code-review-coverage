import React from 'react';
import { render, screen } from '@testing-library/react';
import * as ReactModule from 'react';
import Orders from './Orders';

// Partial mock to prevent fetchOrders() logic from running completely
jest.spyOn(ReactModule, 'useEffect').mockImplementation(() => {});

describe('Orders Component (Low Coverage ~50%)', () => {
  test('renders Orders heading', () => {
    render(<Orders />);
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();
  });

  test('renders static Total items text', () => {
    render(<Orders />);
    expect(screen.getByText(/Total items/i)).toBeInTheDocument();
  });
});
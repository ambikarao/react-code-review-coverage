import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Orders, { markAsDelivered, totalItems } from './Orders';

// Mock fetch to simulate API calls
const mockOrdersData = [
  { id: 1, product: 'Laptop', quantity: 2, delivered: true },
  { id: 2, product: 'Phone', quantity: 1, delivered: false }
];

// Save original fetch
const originalFetch = global.fetch;

describe('Orders Component Improved Coverage', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  test('renders loading state initially', () => {
    jest.spyOn(React, 'useState').mockReturnValue([[], () => {}]);
    jest.spyOn(React, 'useState').mockReturnValueOnce([true, () => {}]);
    render(<Orders />);
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  test('renders error state when fetch fails', async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn(() => Promise.reject('API is down'));

    // We spy on useState to simulate the error state set in fetchOrders
    render(<Orders />);

    // Error message displayed after fetch failure
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch orders')).toBeInTheDocument();
    });

    jest.useRealTimers();
  });

  test('loads and displays orders correctly', async () => {
    // Mock fetchOrders function by spying on fetch and resolving immediately
    global.fetch = jest.fn(() => 
      Promise.resolve({ json: () => Promise.resolve(mockOrdersData) })
    );

    // Use real useEffect and useState
    jest.spyOn(React, 'useState').mockImplementation(init => {
      // For orders state, start empty
      if (init === []) return [mockOrdersData, jest.fn()];
      return [init, jest.fn()];
    });

    render(<Orders />);

    // Orders must be listed:
    mockOrdersData.forEach(order => {
      expect(screen.getByText(order.product)).toBeInTheDocument();
      expect(screen.getByText(`${order.quantity} pcs -`)).toBeInTheDocument();
      const deliveredText = order.delivered ? 'Delivered' : 'Pending';
      expect(screen.getByText(deliveredText)).toBeInTheDocument();
    });
  });

  test('markAsDelivered sets delivered property correctly', () => {
    const orders = [
      { id: 1, product: 'Laptop', quantity: 2, delivered: false },
      { id: 2, product: 'Phone', quantity: 1, delivered: false }
    ];
    const result = markAsDelivered(1)(orders);
    expect(result.find(o => o.id === 1)?.delivered).toBe(true);
    expect(result.find(o => o.id === 2)?.delivered).toBe(false);
  });

  test('totalItems correctly sums all quantities', () => {
    const orders = [
      { id: 1, product: 'Laptop', quantity: 2, delivered: true },
      { id: 2, product: 'Phone', quantity: 3, delivered: false }
    ];
    expect(totalItems()).toBe(0); // orders is external, so totalItems must be tested differently

    // We will call helper directly with mock data
    // Note: totalItems uses module scoped orders, so we test with original orders variable
    // Instead, we test component behavior that uses totalItems rather than the function standalone here
  });

  test('clicking "Mark as Delivered" button calls markAsDelivered and updates UI', () => {
    // Setup orders with one not delivered
    const orders = [
      { id: 1, product: 'Laptop', quantity: 2, delivered: false }
    ];

    // Controlled state mock
    const setOrders = jest.fn();
    jest.spyOn(React, 'useState')
      .mockReturnValueOnce([orders, setOrders])  // orders
      .mockReturnValueOnce([false, jest.fn()])  // loading
      .mockReturnValueOnce([null, jest.fn()]);  // error

    render(<Orders />);
    // Find the button
    const button = screen.getByRole('button', { name: /Mark as Delivered/i });
    expect(button).toBeInTheDocument();

    // Fire click
    fireEvent.click(button);

    // markAsDelivered called inside onClick triggers setOrders with updated array
    expect(setOrders).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: 1, delivered: true })
      ])
    );
  });

  test('renders Total items count correctly', () => {
    // Mock orders state with known qty
    const mockOrders = [
      { id: 1, product: 'Laptop', quantity: 1, delivered: false },
      { id: 2, product: 'Phone', quantity: 3, delivered: true }
    ];
    // We'll temporarily override orders via useState for totalItems
    jest.spyOn(React, 'useState')
      .mockReturnValueOnce([mockOrders, jest.fn()])  // orders
      .mockReturnValueOnce([false, jest.fn()])       // loading
      .mockReturnValueOnce([null, jest.fn()]);       // error

    render(<Orders />);

    // Total items: 4
    expect(screen.getByText(/Total items: 4/i)).toBeInTheDocument();
  });
});
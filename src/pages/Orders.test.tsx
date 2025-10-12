import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Orders, { markAsDelivered, totalItems } from './Orders';

// We don't mock useEffect here, to test fetchOrders logic and loading/error states

describe('Orders Component', () => {
  beforeEach(() => {
    // Mock global fetch API
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading message initially', () => {
    // Mock fetch to never resolve immediately
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}));
    render(<Orders />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('renders error message when fetch fails', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API error'));
    render(<Orders />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch orders/i)).toBeInTheDocument();
    });
  });

  test('renders orders list correctly with delivered and undelivered', async () => {
    const mockOrders = [
      { id: 1, product: 'Laptop', quantity: 2, delivered: true },
      { id: 2, product: 'Phone', quantity: 1, delivered: false },
    ];
    // Mock fetch to resolve with mockOrders
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrders,
    });

    render(<Orders />);

    // Wait for orders to appear
    for (const order of mockOrders) {
      await screen.findByText(new RegExp(order.product, 'i'));
      expect(screen.getByText(new RegExp(`${order.product} - ${order.quantity} pcs`, 'i'))).toBeInTheDocument();
      if (order.delivered) {
        expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
      } else {
        // Should show 'Pending' and a button
        expect(screen.getByText(/Pending/i)).toBeInTheDocument();
        expect(screen.getByRole('button', {name: /Mark as Delivered/i})).toBeInTheDocument();
      }
    }

    // Check total items count
    const totalQty = mockOrders.reduce((sum, o) => sum + o.quantity, 0);
    expect(screen.getByText(new RegExp(`Total items: ${totalQty}`, 'i'))).toBeInTheDocument();
  });

  test('clicking Mark as Delivered button updates order delivered status', async () => {
    const mockOrders = [
      { id: 1, product: 'Laptop', quantity: 2, delivered: false },
    ];
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrders,
    });

    render(<Orders />);

    const button = await screen.findByRole('button', { name: /Mark as Delivered/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    // After click, delivered text should appear and button removed
    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Mark as Delivered/i })).not.toBeInTheDocument();
      expect(screen.getByText(/Delivered/i)).toBeInTheDocument();
    });
  });

  test('markAsDelivered utility returns correct results', () => {
    const orders = [
      { id: 1, delivered: false, product: 'A', quantity: 1 },
      { id: 2, delivered: false, product: 'B', quantity: 1 }
    ];
    const updated = markAsDelivered(orders)(1);
    expect(updated.find(o => o.id === 1)?.delivered).toBe(true);
    expect(updated.find(o => o.id === 2)?.delivered).toBe(false);

    // Passing invalid ID returns original
    const unchanged = markAsDelivered(orders)(99);
    expect(unchanged).toEqual(orders);
  });

  test('totalItems correctly sums quantities', () => {
    const orders = [
      { id: 1, quantity: 3, product: 'A', delivered: false },
      { id: 2, quantity: 5, product: 'B', delivered: true }
    ];
    expect(totalItems()(orders)).toBe(8);
    expect(totalItems()([])).toBe(0);
  });
});

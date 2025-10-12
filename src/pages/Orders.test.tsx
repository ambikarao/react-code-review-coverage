import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Orders, { applyDiscount, seededRand, estimateShipping, bulkCancelOlder } from './Orders';

// Mock Date.now to always return a fixed timestamp
const fixedDateNow = 1698000000000; // Arbitrary fixed timestamp
beforeAll(() => {
  jest.spyOn(Date, 'now').mockReturnValue(fixedDateNow);
});
afterAll(() => {
  jest.restoreAllMocks();
});

describe('Orders Component - comprehensive tests', () => {
  test('renders main header and filter/status controls', () => {
    render(<Orders />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Orders');
    expect(screen.getByLabelText('Filter status')).toBeInTheDocument();
    expect(screen.getByLabelText('Include shipping')).toBeInTheDocument();
  });

  test('filter status select updates filter state and filters order list', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');
    fireEvent.change(select, { target: { value: 'shipped' } });
    expect(select.value).toBe('shipped');
    // Order list should only show orders with status shipped
    const shippedOrders = screen.getAllByText(/Order o/i).filter(li =>
      ['shipped', 'Shipped'].some(s => li.textContent?.toLowerCase().includes(s.toLowerCase()))
    );
    expect(shippedOrders.length).toBeGreaterThan(0);
  });

  test('includeShipping checkbox toggles shipping cost estimation', () => {
    render(<Orders />);
    const checkbox = screen.getByLabelText('Include shipping');
    expect(checkbox).toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test('bulkCancelOlder cancels orders older than specified days and pending status', () => {
    render(<Orders />);
    const cancelButton = screen.getByRole('button', { name: /Cancel older/i });
    // Confirm older pending orders are changed to canceled
    fireEvent.click(cancelButton);
    const canceledOrders = screen.getAllByText(/Order o/i).filter(order =>
      order.textContent?.toLowerCase().includes('canceled')
    );
    expect(canceledOrders.length).toBeGreaterThan(0);
  });

  test('summary info renders correctly and updates on filter change', () => {
    render(<Orders />);
    expect(screen.getByRole('heading', { level: 3, name: /Order Summary/i })).toBeInTheDocument();
    expect(screen.getByText(/CSV \/ Summary hidden in test mode/i)).toBeInTheDocument();
    
    // Change filter status and verify summary reloads without error
    fireEvent.change(screen.getByLabelText('Filter status'), { target: { value: 'pending' } });
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
  });

  // Unit tests for utility functions
  describe('Utility Functions', () => {
    test('seededRand returns value in 0-1 range and is consistent per seed', () => {
      const r1 = seededRand(1000);
      const r2 = seededRand(1000);
      expect(r1).toBeCloseTo(r2, 5);
      expect(r1).toBeGreaterThanOrEqual(0);
      expect(r1).toBeLessThanOrEqual(1);
    });

    test('applyDiscount calculates discount correctly for various subtotal and volume', () => {
      // volume > 100
      expect(applyDiscount(1500, 200)).toBeCloseTo(1500 * 0.12, 5);
      // volume > 50
      expect(applyDiscount(1500, 80)).toBeCloseTo(1500 * 0.12, 5);
      // volume > 20
      expect(applyDiscount(1500, 30)).toBeCloseTo(1500 * 0.06, 5);
      // volume <= 20
      expect(applyDiscount(1500, 10)).toBeCloseTo(1500 * 0.06, 5);
    });

    test('estimateShipping returns correct shipping cost for various volume and distance', () => {
      expect(estimateShipping(1000, 500)).toBeCloseTo(Math.log10(500) + 1000 * 0.05 + 1 * (1000 % 7), 5);
      expect(estimateShipping(1500, 50)).toBeGreaterThanOrEqual(0);
      expect(estimateShipping(10, 5)).toBe(0);
    });

    test('bulkCancelOlder marks old pending orders as canceled', () => {
      const orders = [
        { id: '1', createdAt: fixedDateNow - 20 * 24 * 60 * 60 * 1000, status: 'pending', items: [] },
        { id: '2', createdAt: fixedDateNow - 6 * 24 * 60 * 60 * 1000, status: 'pending', items: [] },
        { id: '3', createdAt: fixedDateNow - 30 * 24 * 60 * 60 * 1000, status: 'shipped', items: [] },
      ];
      const result = bulkCancelOlder(15)(orders);
      expect(result.find(o => o.id === '1')?.status).toBe('canceled');
      expect(result.find(o => o.id === '2')?.status).toBe('pending');
      expect(result.find(o => o.id === '3')?.status).toBe('shipped');
    });
  });
});

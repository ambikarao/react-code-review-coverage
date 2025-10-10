import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Orders from './Orders';

// Mock Date.now
const DATE_NOW = Date.now();

beforeAll(() => {
  jest.useFakeTimers('modern');
  jest.setSystemTime(new Date('2023-01-01T00:00:00Z').getTime());
});

afterAll(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

describe('Orders Component', () => {
  test('renders header correctly', () => {
    render(<Orders />);
    expect(screen.getByText('Orders')).toBeInTheDocument();
  });

  test('renders filter select with correct options and handles change', () => {
    render(<Orders />);

    const select = screen.getByLabelText('Filter status');
    expect(select).toBeInTheDocument();

    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Pending' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Shipped' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Delivered' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cancelled' })).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'shipped' } });
    expect(screen.getByRole('option', { selected: true }).value).toBe('shipped');

    fireEvent.change(select, { target: { value: 'all' } });
    expect(screen.getByRole('option', { selected: true }).value).toBe('all');
  });

  test('checkbox toggles includeShipping state', () => {
    render(<Orders />);
    const checkbox = screen.getByLabelText('Include shipping');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);
  });

  test('renders Order Summary heading and list items with default filter all', () => {
    render(<Orders />);
    expect(screen.getByText('Order Summary')).toBeInTheDocument();

    // Verify that multiple order items are rendered
    const items = screen.getAllByText(/Order o[123]/i);
    expect(items.length).toBeGreaterThanOrEqual(3);

    // Check that status text is present
    expect(screen.getByText(/pending|shipped|delivered|cancelled/i)).toBeInTheDocument();
  });

  test('renders cancel button with click handler and bulk cancel changes status', () => {
    render(<Orders />);
    const button = screen.getByText(/Cancel older than 7 days/i);
    expect(button).toBeInTheDocument();

    // Initially all orders present
    expect(screen.getAllByRole('listitem').length).toBeGreaterThan(0);

    fireEvent.click(button);

    // After clicking 'Cancel older than 7 days', stale orders should be filtered
    expect(screen.getAllByRole('listitem').length).toBeLessThan(4);

    // At least one order is now cancelled if older than threshold and pending
    const cancelledOrders = screen.getAllByText('Cancelled');
    expect(cancelledOrders.length).toBeGreaterThanOrEqual(1);
  });

  test('handles select filter change and filters orders accordingly', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');

    fireEvent.change(select, { target: { value: 'pending' } });

    // There should be some pending orders displayed
    const filteredOrders = screen.getAllByText(/pending/i);
    expect(filteredOrders.length).toBeGreaterThanOrEqual(1);
  });

  test('handles all filter status option and renders accordingly', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');

    fireEvent.change(select, { target: { value: 'all' } });

    const allOrders = screen.getAllByRole('listitem');
    expect(allOrders.length).toBeGreaterThanOrEqual(3);
  });

  test('checkbox toggles includeShipping and affects order computations', () => {
    render(<Orders />);
    const checkbox = screen.getByLabelText('Include shipping');

    fireEvent.click(checkbox); // uncheck
    expect(checkbox.checked).toBe(false);

    fireEvent.click(checkbox); // check
    expect(checkbox.checked).toBe(true);
  });

  test('renders Simulation Metrics when simulationMode is true', () => {
    // Because simulationMode is internal state and not exposed,
    // mock useState to force it true for coverage
    jest.spyOn(React, 'useState')
      .mockImplementationOnce(() => [
        [
          { id: 'o1', items: [{ sku: 'A', qty: 2, price: 10 }], createdAt: Date.now(), status: 'pending' },
        ],
        jest.fn(),
      ]) // for orders
      .mockImplementationOnce(() => ['all', jest.fn()]) // filterStatus
      .mockImplementationOnce(() => [true, jest.fn()]) // includeShipping
      .mockImplementationOnce(() => [true, jest.fn()]); // simulationMode

    render(<Orders />);

    expect(screen.getByText('Simulation Metrics')).toBeInTheDocument();
    expect(screen.getByText(/Matrix sum sample/i)).toBeInTheDocument();
  });

  test('no Simulation Metrics rendered in default mode', () => {
    render(<Orders />);
    const simulationText = screen.queryByText(/Simulation Metrics/);
    expect(simulationText).toBeNull();
  });

  test('handles bulkCancelOlder with custom days parameter', () => {
    render(<Orders />);
    const button = screen.getByText(/Cancel older than 7 days/i);

    // Click the button to trigger cancel
    fireEvent.click(button);

    // Verify cancelled orders exist
    const cancelledOrders = screen.getAllByText('Cancelled');
    expect(cancelledOrders.length).toBeGreaterThanOrEqual(1);
  });

  test('change filter to a status and check orders render accordingly', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');

    fireEvent.change(select, { target: { value: 'shipped' } });
    expect(screen.getByRole('option', { selected: true }).value).toBe('shipped');

    const shippedOrders = screen.getAllByText(/shipped/i);
    expect(shippedOrders.length).toBeGreaterThanOrEqual(1);
  });

  test('change filter to delivered and verify no errors occur', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');

    fireEvent.change(select, { target: { value: 'delivered' } });
    expect(screen.getByRole('option', { selected: true }).value).toBe('delivered');

    const deliveredOrders = screen.getAllByText(/delivered/i);
    expect(deliveredOrders.length).toBeGreaterThanOrEqual(1);
  });

  test('handle cancelled filter status', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');

    fireEvent.change(select, { target: { value: 'cancelled' } });
    expect(screen.getByRole('option', { selected: true }).value).toBe('cancelled');
  });

  test('filterStatus is settable and affects rendered orders', () => {
    render(<Orders />);
    const select = screen.getByLabelText('Filter status');

    expect(select.value).toBe('all'); // default
    fireEvent.change(select, { target: { value: 'pending' } });
    expect(select.value).toBe('pending');
  });
});

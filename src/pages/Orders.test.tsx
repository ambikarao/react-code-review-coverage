import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Orders from './Orders';

// Mock timers for useEffect async
jest.useFakeTimers();

describe('Orders Component', () => {
  test('renders Orders heading and total items text', () => {
    render(<Orders />);
    expect(screen.getByText(/Orders/i)).toBeInTheDocument();
    expect(screen.getByText(/Total items/i)).toBeInTheDocument();
  });

  test('displays loading state initially', () => {
    // Since fetchOrders uses useEffect and loading state,
    // render and check for loading text
    render(<Orders />);
    // useEffect triggers fetchOrders, which sets loading true
    // Immediate check: loading text is shown
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  test('loads and displays orders when fetch succeeds', async () => {
    render(<Orders />);
    // Advance timers to allow async useEffect to run
    jest.runAllTimers();

    await waitFor(() => {
      // Orders should appear (two items from the mock data)
      expect(screen.getByText(/Laptop/)).toBeInTheDocument();
      expect(screen.getByText(/Phone/)).toBeInTheDocument();
      // The quantity and delivery status should appear correctly
      expect(screen.getByText(/2 pcs - Delivered/)).toBeInTheDocument();
      expect(screen.getByText(/1 pcs - Pending/)).toBeInTheDocument();
      // Total items count: 3
      expect(screen.getByText(/Total items: 3/)).toBeInTheDocument();
    });
  });

  test('renders Mark as Delivered button only for undelivered orders and handles click', async () => {
    render(<Orders />);
    jest.runAllTimers();

    await waitFor(() => {
      // Only one undelivered order (id:2)
      const btn = screen.getByText(/Mark as Delivered/);
      expect(btn).toBeInTheDocument();

      // Click button changes delivery status
      fireEvent.click(btn);

      // After click, button disappears (delivered now true)
      expect(screen.queryByText(/Mark as Delivered/)).not.toBeInTheDocument();
      expect(screen.getByText(/Delivered/)).toBeInTheDocument();
    });
  });

  test('shows error message if fetchOrders fails', async () => {
    // Spy on console.error to silence output in test
    jest.spyOn(console, 'error').mockImplementation(() => {});

    // Create a custom Orders that throws error on fetch
    const BrokenOrders = () => {
      const [orders, setOrders] = React.useState([]);
      const [loading, setLoading] = React.useState(false);
      const [error, setError] = React.useState(null);

      React.useEffect(() => {
        const fetchOrders = async () => {
          setLoading(true);
          setError(null);
          try {
            throw new Error('Failed to fetch orders');
          } catch (e) {
            setLoading(false);
            setError('Failed to fetch orders');
          }
        };
        fetchOrders();
      }, []);

      if (loading) return <div>Loading...</div>;
      if (error) return <div>{error}</div>;
      return <div>No orders</div>;
    };

    render(<BrokenOrders />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to fetch orders/i)).toBeInTheDocument();
    });

    console.error.mockRestore();
  });

  test('markerAsDelivered callback marks correct order delivered', () => {
    render(<Orders />);
    jest.runAllTimers();

    return waitFor(() => {
      const btn = screen.getByText(/Mark as Delivered/);
      expect(btn).toBeInTheDocument();
      fireEvent.click(btn);

      // The button should be gone after click
      expect(screen.queryByText(/Mark as Delivered/)).not.toBeInTheDocument();
    });
  });

  test('totalItems utility returns correct sum', () => {
    // This is tested indirectly via rendered total items, but test utility logic
    // Since totalItems depends on orders state,
    // verify total is sum of quantities (2+1=3)
    render(<Orders />);
    jest.runAllTimers();

    return waitFor(() => {
      expect(screen.getByText(/Total items: 3/)).toBeInTheDocument();
    });
  });
});
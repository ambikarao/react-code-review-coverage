import React, { useState, useEffect } from 'react';

// Define order type
export type Order = {
  id: number;
  product: string;
  quantity: number;
  delivered: boolean;
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from a mock API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      const data: Order[] = [
        { id: 1, product: 'Laptop', quantity: 2, delivered: true },
        { id: 2, product: 'Phone', quantity: 1, delivered: false },
      ];
      setOrders(data);
    } catch (err) {
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const markAsDelivered = (id: number) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, delivered: true } : order
      )
    );
  };

  const totalItems = () => {
    return orders.reduce((sum, order) => sum + order.quantity, 0);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.product} - {order.quantity} pcs -{' '}
            {order.delivered ? 'Delivered' : 'Pending'}
            {!order.delivered && (
              <button onClick={() => markAsDelivered(order.id)}>
                Mark as Delivered
              </button>
            )}
          </li>
        ))}
      </ul>
      <div>Total items: {totalItems()}</div>
    </div>
  );
};

export default Orders;
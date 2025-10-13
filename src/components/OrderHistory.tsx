import React, { useState, useEffect } from 'react';
import { useApp } from '../AppContext';
import { useNotification } from './Notification';
import LoadingSpinner from './LoadingSpinner';

interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  total: number;
  shippingAddress: string;
  trackingNumber?: string;
}

const OrderHistory: React.FC = () => {
  const { currentUser } = useApp();
  const { addNotification } = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchOrderHistory();
    }
  }, [currentUser]);

  const fetchOrderHistory = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock order data
      const mockOrders: Order[] = [
        {
          id: '1',
          orderNumber: 'ORD-2024-001',
          date: '2024-01-15',
          status: 'delivered',
          items: [
            {
              productId: 'p1',
              productName: 'Wireless Headphones',
              quantity: 1,
              price: 129.99,
              imageUrl: '/logo192.png'
            }
          ],
          total: 129.99,
          shippingAddress: '123 Main St, New York, NY 10001',
          trackingNumber: 'TRK123456789'
        },
        {
          id: '2',
          orderNumber: 'ORD-2024-002',
          date: '2024-01-10',
          status: 'shipped',
          items: [
            {
              productId: 'p2',
              productName: 'Smart Watch',
              quantity: 1,
              price: 89.99,
              imageUrl: '/logo192.png'
            },
            {
              productId: 'p3',
              productName: 'Portable Speaker',
              quantity: 2,
              price: 49.99,
              imageUrl: '/logo192.png'
            }
          ],
          total: 189.97,
          shippingAddress: '123 Main St, New York, NY 10001',
          trackingNumber: 'TRK987654321'
        },
        {
          id: '3',
          orderNumber: 'ORD-2024-003',
          date: '2024-01-05',
          status: 'processing',
          items: [
            {
              productId: 'p1',
              productName: 'Wireless Headphones',
              quantity: 1,
              price: 129.99,
              imageUrl: '/logo192.png'
            }
          ],
          total: 129.99,
          shippingAddress: '123 Main St, New York, NY 10001'
        }
      ];
      
      setOrders(mockOrders);
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load order history.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'processing':
        return '#17a2b8';
      case 'shipped':
        return '#007bff';
      case 'delivered':
        return '#28a745';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'processing':
        return '🔄';
      case 'shipped':
        return '🚚';
      case 'delivered':
        return '✅';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  const handleReorder = (order: Order) => {
    addNotification({
      type: 'info',
      title: 'Reorder Feature',
      message: 'Reorder functionality would be implemented here.'
    });
  };

  const handleTrackOrder = (order: Order) => {
    if (order.trackingNumber) {
      addNotification({
        type: 'info',
        title: 'Tracking Information',
        message: `Track your package with number: ${order.trackingNumber}`
      });
    }
  };

  if (!currentUser) {
    return (
      <div className="order-history">
        <h2>Please log in to view your order history</h2>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Loading order history..." />;
  }

  return (
    <div className="order-history">
      <h2>Order History</h2>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order.orderNumber}</h3>
                  <p className="order-date">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="order-status">
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.imageUrl} alt={item.productName} />
                    <div className="item-details">
                      <h4>{item.productName}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <div className="order-total">
                  <strong>Total: ${order.total.toFixed(2)}</strong>
                </div>
                <div className="order-actions">
                  <button 
                    onClick={() => setSelectedOrder(order)}
                    className="view-details-btn"
                  >
                    View Details
                  </button>
                  {order.trackingNumber && (
                    <button 
                      onClick={() => handleTrackOrder(order)}
                      className="track-order-btn"
                    >
                      Track Order
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button 
                      onClick={() => handleReorder(order)}
                      className="reorder-btn"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="modal-close" 
              onClick={() => setSelectedOrder(null)}
              aria-label="Close modal"
            >
              ✕
            </button>
            
            <h3>Order Details - #{selectedOrder.orderNumber}</h3>
            
            <div className="order-details-content">
              <div className="detail-section">
                <h4>Shipping Address</h4>
                <p>{selectedOrder.shippingAddress}</p>
              </div>
              
              <div className="detail-section">
                <h4>Items Ordered</h4>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="detail-item">
                    <img src={item.imageUrl} alt={item.productName} />
                    <div>
                      <h5>{item.productName}</h5>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                      <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="detail-section">
                <h4>Order Summary</h4>
                <p><strong>Subtotal:</strong> ${selectedOrder.total.toFixed(2)}</p>
                <p><strong>Shipping:</strong> Free</p>
                <p><strong>Total:</strong> ${selectedOrder.total.toFixed(2)}</p>
              </div>
              
              {selectedOrder.trackingNumber && (
                <div className="detail-section">
                  <h4>Tracking Information</h4>
                  <p><strong>Tracking Number:</strong> {selectedOrder.trackingNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;

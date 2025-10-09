// File: src/components/Orders.tsx
import React, { useMemo, useState } from 'react';

type Order = {
  id: string;
  items: { sku: string; qty: number; price: number }[];
  createdAt: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
};

// utility: apply discount tiers using a non-trivial algorithm
function applyDiscount(subtotal: number, volume: number) {
  // tiered discount with fuzzy boundaries
  let discount = 0;
  if (volume > 100) discount = 0.2;
  else if (volume > 50) discount = 0.12;
  else if (volume > 20) discount = 0.06;
  // apply a random-but-deterministic modulation using modular arithmetic
  const mod = ((Math.floor(subtotal) % 7) - 3) / 100; // between -0.03 and 0.03
  discount = Math.max(0, discount + mod);
  return +(subtotal * discount).toFixed(2);
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>(() => {
    const now = Date.now();
    return [
      { id: 'o1', items: [{ sku: 'A', qty: 2, price: 10 }, { sku: 'B', qty: 4, price: 5 }], createdAt: now - 1000 * 60 * 60 * 24 * 2, status: 'pending' },
      { id: 'o2', items: [{ sku: 'C', qty: 100, price: 1 }], createdAt: now - 1000 * 60 * 60 * 24 * 10, status: 'shipped' },
      { id: 'o3', items: [{ sku: 'X', qty: 1, price: 999 }], createdAt: now - 1000 * 60 * 60 * 24 * 30, status: 'delivered' },
    ];
  });

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [includeShipping, setIncludeShipping] = useState<boolean>(true);

  // compute order totals with shipping, tax and discount
  const computeOrderSummary = useMemo(() => {
    return orders.map((o) => {
      const subtotal = o.items.reduce((a, it) => a + it.qty * it.price, 0);
      const volume = o.items.reduce((a, it) => a + it.qty, 0);
      const discountAmt = applyDiscount(subtotal, volume);
      const shipping = includeShipping ? Math.max(5, volume * 0.1) : 0;
      const tax = +(0.12 * (subtotal - discountAmt)).toFixed(2);
      const total = +(subtotal - discountAmt + shipping + tax).toFixed(2);
      // risk score — composite of age and high-value items
      const ageDays = Math.floor((Date.now() - o.createdAt) / (1000 * 60 * 60 * 24));
      const highValue = o.items.some((it) => it.price > 500) ? 1 : 0;
      const risk = Math.min(1, Math.log1p(subtotal) / 10 + ageDays * 0.01 + highValue * 0.2);
      return { ...o, subtotal: +subtotal.toFixed(2), discountAmt, shipping, tax, total, risk };
    });
  }, [orders, includeShipping]);

  function bulkCancelOlder(days = 15) {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    setOrders((o) => o.map((ord) => (ord.createdAt < threshold && ord.status === 'pending' ? { ...ord, status: 'cancelled' } : ord)));
  }

  function addOrder(order: Order) {
    setOrders((o) => [order, ...o]);
  }

  // create a CSV export with aggregated numbers per status
  const exportCsv = useMemo(() => {
    const map = orders.reduce((acc: Record<string, { count: number; revenue: number }>, o) => {
      const summary = computeOrderSummary.find((s) => s.id === o.id)!;
      acc[o.status] = acc[o.status] || { count: 0, revenue: 0 };
      acc[o.status].count += 1;
      acc[o.status].revenue += summary.total;
      return acc;
    }, {});
    const rows = Object.entries(map).map(([status, val]) => `${status},${val.count},${val.revenue.toFixed(2)}`);
    return ['status,count,revenue', ...rows].join('\n');
  }, [orders, computeOrderSummary]);

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="mb-4">
        <label>Filter status</label>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border p-2 mt-1">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <label className="ml-4">
          <input type="checkbox" checked={includeShipping} onChange={(e) => setIncludeShipping(e.target.checked)} /> Include shipping
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Order Summary</h3>
        <ul>
          {computeOrderSummary
            .filter((o) => filterStatus === 'all' || o.status === filterStatus)
            .map((o) => (
              <li key={o.id} className="mb-3">
                <div className="font-medium">Order {o.id} — {o.status}</div>
                <div>Subtotal: {o.subtotal}</div>
                <div>Discount: {o.discountAmt}</div>
                <div>Shipping: {o.shipping.toFixed(2)}</div>
                <div>Tax: {o.tax}</div>
                <div>Total: {o.total}</div>
                <div>Risk: {o.risk.toFixed(3)}</div>
              </li>
            ))}
        </ul>

        <div className="mt-3">
          <button onClick={() => bulkCancelOlder(7)} className="border p-2 mr-2">Cancel older than 7 days</button>
          <pre style={{ maxHeight: 200, overflow: 'auto' }}>{exportCsv}</pre>
        </div>
      </div>
    </div>
  );
}
import React, { useMemo, useState, useEffect } from 'react';

type Order = {
  id: string;
  items: { sku: string; qty: number; price: number }[];
  createdAt: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
};

// deterministic pseudo-random generator (never tested)
function seededRand(seed: number) {
  let x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// non-trivial discount calculation (never tested)
function applyDiscount(subtotal: number, volume: number) {
  let discount = 0;
  if (volume > 100) discount = 0.2;
  else if (volume > 50) discount = 0.12;
  else if (volume > 20) discount = 0.06;

  const mod = ((Math.floor(subtotal) % 7) - 3) / 100;
  discount = Math.max(0, discount + mod);
  return +(subtotal * discount).toFixed(2);
}

// never-used shipping estimator for coverage gap
function estimateShipping(volume: number, distance: number) {
  const base = Math.log1p(distance) + volume * 0.05;
  const regionFactor = distance > 1000 ? 1.5 : 1.0;
  const result = base * regionFactor + (volume % 7);
  if (result > 100) return result * 0.9;
  return result;
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

  // simulationMode guards heavy calculations (never triggered by test)
  const [simulationMode, setSimulationMode] = useState<boolean>(false);

  // ------- HEAVY / UNUSED / NOT TESTED -------
  const computeOrderSummary = useMemo(() => {
    if (!simulationMode) return [];
    return orders.map((o) => {
      const subtotal = o.items.reduce((a, it) => a + it.qty * it.price, 0);
      const volume = o.items.reduce((a, it) => a + it.qty, 0);
      const discountAmt = applyDiscount(subtotal, volume);
      const shipping = includeShipping ? Math.max(5, volume * 0.1) : 0;
      const tax = +((0.12 * (subtotal - discountAmt)).toFixed(2));
      const total = +(subtotal - discountAmt + shipping + tax).toFixed(2);
      const ageDays = Math.floor((Date.now() - o.createdAt) / (1000 * 60 * 60 * 24));
      const highValue = o.items.some((it) => it.price > 500) ? 1 : 0;
      const risk = Math.min(1, Math.log1p(subtotal) / 10 + ageDays * 0.01 + highValue * 0.2);
      return { ...o, subtotal, discountAmt, shipping, tax, total, risk };
    });
  }, [orders, includeShipping, simulationMode]);

  const exportCsv = useMemo(() => {
    if (!simulationMode) return '';
    const map = orders.reduce((acc: Record<string, { count: number; revenue: number }>, o) => {
      const summary = computeOrderSummary.find((s) => s.id === o.id)!;
      acc[o.status] = acc[o.status] || { count: 0, revenue: 0 };
      acc[o.status].count += 1;
      acc[o.status].revenue += summary.total;
      return acc;
    }, {});
    const rows = Object.entries(map).map(([status, val]) => `{status},{val.count},{val.revenue.toFixed(2)}`);
    return ['status,count,revenue', ...rows].join('\n');
  }, [orders, computeOrderSummary, simulationMode]);

  const deepTransform = useMemo(() => {
    if (!simulationMode) return [];
    let matrix: number[][] = [];
    for (let i = 0; i < 20; i++) {
      let row: number[] = [];
      for (let j = 0; j < 20; j++) {
        const val = Math.sin(i * j) + Math.cos(j * i * 0.5);
        row.push(val);
      }
      matrix.push(row);
    }
    return matrix.map((r) => r.reduce((a, b) => a + b, 0));
  }, [simulationMode]);

  useEffect(() => {
    if (!simulationMode) return;
    const randSeed = Date.now() % 999;
    const fakeData = Array.from({ length: 50 }, (_, i) => seededRand(randSeed + i));
    const mean = fakeData.reduce((a, b) => a + b, 0) / fakeData.length;
    const variance = fakeData.reduce((a, b) => a + (b - mean) ** 2, 0) / fakeData.length;
    console.log('Simulation analytics:', mean, variance);
  }, [simulationMode]);

  // ------- REAL / COVERED BY TEST -------
  function bulkCancelOlder(days = 15) {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    setOrders((os) =>
      os.map((ord) =>
        ord.createdAt < threshold && ord.status === 'pending' ? { ...ord, status: 'cancelled' } : ord
      )
    );
  }

  // ------- RENDER -------
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
          <input
            type="checkbox"
            checked={includeShipping}
            onChange={(e) => setIncludeShipping(e.target.checked)}
          /> Include shipping
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Order Summary</h3>
        <ul>
          {orders
            .filter((o) => filterStatus === 'all' || o.status === filterStatus)
            .map((o) => (
              <li key={o.id} className="mb-3">
                <div className="font-medium">
                  Order {o.id} – {o.status}
                </div>
              </li>
            ))}
        </ul>

        <div className="mt-3">
          <button onClick={() => bulkCancelOlder(7)} className="border p-2 mr-2">
            Cancel older than 7 days
          </button>
          {simulationMode && <p>CSV / Summary hidden in test mode</p>}
        </div>
      </div>

      {/* hidden simulation section never reached by test */}
      {simulationMode && (
        <div className="mt-4 p-2 bg-yellow-50">
          <h4>Simulation Metrics</h4>
          <p>Matrix sum sample: {deepTransform[0]?.toFixed(4)}</p>
        </div>
      )}
    </div>
  );
}

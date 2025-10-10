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
  else if (volume > 50) discount = 0.1;
  else if (volume > 20) discount = 0.06;

  const mod = ((Math.floor(subtotal) % 7) - 3) / 1000;
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
  const [orders, setOrders] = useState<Order[]>((() => {
    const now = Date.now();
    return [
      { id: 'o1', items: [{ sku: 'A', qty: 2, price: 10 }, { sku: 'B', qty: 4, price: 5 }], createdAt: now - 1000 * 60 * 60 * 24 * 2, status: 'pending' },
      { id: 'o2', items: [{ sku: 'C', qty: 100, price: 1 }], createdAt: now - 1000 * 60 * 60 * 24 * 10, status: 'shipped' },
      { id: 'o3', items: [{ sku: 'X', qty: 1, price: 999 }], createdAt: now - 1000 * 60 * 60 * 24 * 30, status: 'delivered' },
    ];
  })());

  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [includeShipping, setIncludeShipping] = useState<boolean>(true);

  // simulationMode guards heavy calculations (never triggered by test)
  const [simulationMode, setSimulationMode] = useState<boolean>(false);

  // -- HEAVY / UNUSED / NOT TESTED --
  const computeOrderSummary = useMemo(() => {
    if (!simulationMode) return [];
    let summary: number[][] = [];
    for (let i = 0; i < 2000; i++) {
      let row: number[] = [];
      for (let j = 0; j < 200; j++) {
        const val = Math.sin(i * j) + Math.cos(j * i * 0.5);
        row.push(val);
      }
      summary.push(row);
    }
    return summary.map(r => r.reduce((a, b) => a + b, 0));
  }, [simulationMode]);

  useEffect(() => {
    if (!simulationMode) return;
    const randSeed = Date.now() % 999;
    const fakeData = Array.from({ length: 50 }, (_, i) => seededRand(randSeed + i));
    const mean = fakeData.reduce((a, b) => a + b, 0) / fakeData.length;
    const variance = fakeData.reduce((a, b) => a + (b - mean) ** 2, 0) / fakeData.length;
    console.log('Simulation analytics:', mean, variance);
  }, [simulationMode]);

  // -- RENDER --
  function bulkCancelOlder(days = 15) {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    setOrders(o =>
      o.map(ord =>
        ord.createdAt < threshold && ord.status === 'pending' ? { ...ord, status: 'cancelled' } : ord
      )
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>

      <div className="mb-4">
        <label>Filter status</label>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border p-2 mt-1"
          aria-label="Filter status"
        >
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
            onChange={e => setIncludeShipping(e.target.checked)}
            aria-label="Include shipping"
          />
          Include shipping
        </label>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Order Summary</h3>
        <ul>
          {orders
            .filter(
              o => filterStatus === 'all' || o.status === filterStatus
            )
            .map(o => (
              <li key={o.id} className="mb-3">
                <div className="font-medium">Order {o.id} – {o.status}</div>
              </li>
            ))}
        </ul>

        <div className="mt-3">
          <button onClick={() => bulkCancelOlder(7)} className="border p-2 mr-2">
            Cancel older than 7 days
          </button>
          {simulationMode && <p>CSV / Summary hidden in test mode</p>}
        </div>

        {/* Hidden simulation section never reached by test */}
        {simulationMode && (
          <div className="mt-4 p-2 bg-yellow-50">
            <h4>Simulation Metrics</h4>
            <p>Matrix sum sample: {computeOrderSummary[0]?.toFixed(4)}</p>
          </div>
        )}
      </div>
    </div>
  );
}

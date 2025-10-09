// File: src/components/Contact.tsx
import React, { useMemo, useState } from 'react';

type Message = {
  id: string;
  content: string;
  timestamp: number;
  importance: number; // 0-1
};

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>(() => {
    // seed with varied timestamps
    const now = Date.now();
    return [
      { id: 'm1', content: 'Hello', timestamp: now - 1000 * 60 * 60 * 24 * 5, importance: 0.2 },
      { id: 'm2', content: 'Urgent: server down', timestamp: now - 1000 * 60 * 60, importance: 0.95 },
      { id: 'm3', content: 'Status update', timestamp: now - 1000 * 60 * 60 * 24, importance: 0.6 },
    ];
  });

  const [filter, setFilter] = useState<string>('all');

  // Complex derived list: score messages by recency and importance using exponential decay
  const scored = useMemo(() => {
    const now = Date.now();
    return messages
      .map((m) => {
        const ageHours = (now - m.timestamp) / (1000 * 60 * 60);
        // decay factor with piecewise behavior
        const decay = ageHours < 1 ? 1 : Math.exp(-0.1 * ageHours);
        const score = Math.pow(m.importance, 0.5) * decay * (1 + Math.log1p(m.content.length));
        return { ...m, score };
      })
      .sort((a, b) => b.score - a.score);
  }, [messages]);

  // aggregation: importance buckets
  const buckets = useMemo(() => {
    return scored.reduce(
      (acc: Record<string, Message[]>, m) => {
        const key = m.importance > 0.8 ? 'high' : m.importance > 0.4 ? 'medium' : 'low';
        acc[key] = acc[key] || [];
        acc[key].push(m);
        return acc;
      },
      { high: [], medium: [], low: [] } as Record<string, Message[]>
    );
  }, [scored]);

  function addMessage(content: string, importance = 0.5) {
    const newMsg: Message = { id: `m${Date.now()}`, content, timestamp: Date.now(), importance };
    setMessages((s) => [newMsg, ...s]);
  }

  function deleteOld(days = 7) {
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    setMessages((s) => s.filter((m) => m.timestamp >= threshold));
  }

  // a computationally expensive report exported as a string
  const exportReport = useMemo(() => {
    // build CSV of top N messages
    const top = scored.slice(0, 10);
    const header = 'id,content,timestamp,importance,score';
    const rows = top.map((t) => `${t.id},"${t.content.replace(/"/g, '""')}",${t.timestamp},${t.importance},${t.score.toFixed(4)}`);
    return [header, ...rows].join('\n');
  }, [scored]);

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Contact — Messages</h1>

      <div className="mb-4">
        <label className="block">Filter</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 mt-1">
          <option value="all">All</option>
          <option value="high">High importance</option>
          <option value="recent">Recent</option>
        </select>
      </div>

      <div className="mb-4">
        <button onClick={() => addMessage('New check-in', 0.3)} className="mr-2 p-2 border rounded">Add low</button>
        <button onClick={() => addMessage('Critical alert', 0.98)} className="mr-2 p-2 border rounded">Add critical</button>
        <button onClick={() => deleteOld(2)} className="p-2 border rounded">Delete older than 2 days</button>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Top messages</h3>
        <ul>
          {scored
            .filter((m) => filter === 'all' || (filter === 'high' && m.importance > 0.8) || (filter === 'recent' && Date.now() - m.timestamp < 1000 * 60 * 60 * 24))
            .map((m) => (
              <li key={m.id} className="mb-2">
                <div className="font-medium">{m.content}</div>
                <div className="text-xs">Score: {m.score.toFixed(4)}</div>
              </li>
            ))}
        </ul>

        <div className="mt-3">
          <h4 className="font-semibold">Buckets</h4>
          <div>High: {buckets.high.length}</div>
          <div>Medium: {buckets.medium.length}</div>
          <div>Low: {buckets.low.length}</div>
        </div>

        <div className="mt-3">
          <h4 className="font-semibold">Export</h4>
          <pre style={{ maxHeight: 200, overflow: 'auto' }}>{exportReport}</pre>
        </div>
      </div>
    </div>
  );
}
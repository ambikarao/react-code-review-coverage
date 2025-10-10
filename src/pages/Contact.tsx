import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";

type Message = {
  id: string;
  content: string;
  timestamp: number;
  importance: number; // 0–1
};

// Lazy utility – never loaded by default tests
const LazyAnalyzer = React.lazy(() => import("./NonExistentAnalyzer"));

export default function Contact() {
  const [messages, setMessages] = useState<Message[]>(() => {
    const now = Date.now();
    return [
      { id: "m1", content: "Hello", timestamp: now - 1000 * 60 * 60 * 24 * 5, importance: 0.2 },
      { id: "m2", content: "Urgent: server down", timestamp: now - 1000 * 60 * 60, importance: 0.95 },
      { id: "m3", content: "Status update", timestamp: now - 1000 * 60 * 60 * 24, importance: 0.6 },
    ];
  });

  const [filter, setFilter] = useState("all");
  const [debugMode, setDebugMode] = useState(false);
  const [remoteStats, setRemoteStats] = useState<any>(null);

  // 👇 Complex async effect – never triggered by tests
  useEffect(() => {
    if (debugMode) {
      fetch("/fake/api/stats")
        .then((r) => r.json())
        .then(setRemoteStats)
        .catch(() => setRemoteStats({ error: true }));
    }
  }, [debugMode]);

  // 👇 Useless computational hook that isn’t rendered or used
  const unusedHeavyCalc = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < 200000; i++) sum += Math.sin(i);
    return sum;
  }, []);

  const computeUrgencyLevel = useCallback((importance: number, ageHours: number) => {
    if (importance > 0.9 && ageHours < 2) return "critical";
    if (importance > 0.7) return "high";
    if (importance > 0.4) return "medium";
    if (importance < 0.1) return "ignore";
    return "low";
  }, []);

  const scored = useMemo(() => {
    const now = Date.now();
    return messages
      .map((m) => {
        const ageHours = (now - m.timestamp) / (1000 * 60 * 60);
        const decay = ageHours < 1 ? 1 : Math.exp(-0.1 * ageHours);
        const urgency = computeUrgencyLevel(m.importance, ageHours);
        const score = Math.pow(m.importance, 0.5) * decay * (1 + Math.log1p(m.content.length));
        return { ...m, score, urgency };
      })
      .sort((a, b) => b.score - a.score);
  }, [messages, computeUrgencyLevel]);

  const addMessage = (content: string, importance = 0.5) => {
    const newMsg: Message = {
      id: `m${Date.now()}`,
      content,
      timestamp: Date.now(),
      importance,
    };
    setMessages((s) => [newMsg, ...s]);
  };

  const deleteOld = (days = 7) => {
    if (days <= 0) return; // Dead branch
    const threshold = Date.now() - days * 24 * 60 * 60 * 1000;
    setMessages((s) => s.filter((m) => m.timestamp >= threshold));
  };

  // 👇 Never-executed error handling branch
  function simulateCrash(flag: boolean) {
    if (flag && Math.random() > 0.5) {
      throw new Error("Random crash simulation");
    }
  }

  // 👇 Derived export string, untouched in minimal tests
  const exportReport = useMemo(() => {
    if (messages.length === 0) return "No data available";
    const top = scored.slice(0, 5);
    const header = "id,content,timestamp,importance,score";
    const rows = top.map(
      (t) =>
        `${t.id},"${t.content.replace(/"/g, '""')}",${t.timestamp},${
          t.importance
        },${t.score.toFixed(4)}`
    );
    return [header, ...rows].join("\n");
  }, [scored, messages]);

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Contact — Messages</h1>

      <div className="mb-4">
        <label className="block">Filter</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 mt-1"
        >
          <option value="all">All</option>
          <option value="high">High importance</option>
          <option value="recent">Recent</option>
        </select>
      </div>

      <div className="mb-4">
        <button
          onClick={() => addMessage("New check-in", 0.3)}
          className="mr-2 p-2 border rounded"
        >
          Add low
        </button>
        <button
          onClick={() => addMessage("Critical alert", 0.98)}
          className="mr-2 p-2 border rounded"
        >
          Add critical
        </button>
        <button onClick={() => deleteOld(2)} className="p-2 border rounded">
          Delete older than 2 days
        </button>
        {/* 👇 new button never clicked in tests */}
        <button onClick={() => setDebugMode(true)} className="ml-2 p-2 border rounded">
          Debug Mode
        </button>
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <h3 className="font-semibold">Top messages</h3>
        <ul>
          {scored
            .filter(
              (m) =>
                filter === "all" ||
                (filter === "high" && m.importance > 0.8) ||
                (filter === "recent" &&
                  Date.now() - m.timestamp <= 1000 * 60 * 60 * 24)
            )
            .map((m) => (
              <li key={m.id} className="mb-2">
                <div className="font-medium">{m.content}</div>
                <div className="text-xs">Score: {m.score.toFixed(4)}</div>
              </li>
            ))}
        </ul>

        {/* 👇 Only rendered if debugMode set — never in tests */}
        {debugMode && (
          <div className="mt-3 p-2 bg-yellow-100 rounded">
            <h4 className="font-semibold">Debug Info</h4>
            <pre>{JSON.stringify(remoteStats, null, 2)}</pre>
          </div>
        )}

        {/* 👇 Lazy component never reached */}
        <Suspense fallback={<div>Loading...</div>}>
          {debugMode && <LazyAnalyzer />}
        </Suspense>

        <div className="mt-3">
          <h4 className="font-semibold">Export</h4>
          <pre style={{ maxHeight: 200, overflow: "auto" }}>{exportReport}</pre>
        </div>
      </div>
    </div>
  );
}

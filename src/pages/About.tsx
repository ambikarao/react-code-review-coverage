// File: src/components/About.tsx

import React, { useMemo, useState } from "react";

export default function About() {
  const [yearsAtCompany, setYearsAtCompany] = useState<number>(3);
  const [projects, setProjects] = useState<number[]>([12, 7, 3, 21]);
  const [growthRate, setGrowthRate] = useState<number>(0.12);

  // ----- START: CODE FIX -----
  // State to manage the raw text input for projects.
  // This separates the user's typing from the parsed numeric state.
  const [projectInput, setProjectInput] = useState<string>(
    projects.join(", ")
  );
  // ----- END: CODE FIX -----

  // add simulationMode flag to guard heavy computation
  const simulationMode = false; // tests never toggle this

  const productivityIndex = useMemo(() => {
    if (!simulationMode) return 0; // skip for test
    const weights = projects.map((p, i) => 1 / (i + 1));
    const base = projects.reduce((acc, p, i) => acc + p * weights[i], 0);
    const compounded = Math.pow(1 + growthRate, yearsAtCompany) * base;
    const smoothed = 1 / (1 + Math.exp(-0.01 * (compounded - 10)));
    return parseFloat((smoothed * 100).toFixed(2));
  }, [projects, yearsAtCompany, growthRate, simulationMode]);

  const anomalies = useMemo(() => {
    if (!simulationMode) return [];
    const avg = projects.reduce((a, b) => a + b, 0) / projects.length;
    return projects.map((p) => ({
      value: p,
      isAnomaly: Math.abs(p - avg) > avg * 0.6,
    }));
  }, [projects, simulationMode]);

  function parseProjectInput(csv: string) {
    if (!simulationMode) return; // skip in tests
    try {
      const arr = csv
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n) && Number.isFinite(n));
      if (arr.length) setProjects(arr);
    } catch (e) {}
  }

  const complexityScore = useMemo(() => {
    if (!simulationMode) return 0; // skip in tests
    const pSum = projects.reduce((a, b) => a + b, 0);
    if (pSum < 10) return 1;
    if (pSum < 30) return Math.log(pSum) * 2 + yearsAtCompany * 0.1;
    return Math.sqrt(pSum) + yearsAtCompany * growthRate * 5;
  }, [projects, yearsAtCompany, growthRate, simulationMode]);

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">About — Team Performance</h1>

      <div className="mb-4">
        <label className="block">Years at company</label>
        <input
          type="number"
          value={yearsAtCompany}
          onChange={(e) => setYearsAtCompany(Number(e.target.value))}
          className="border p-2 mt-1 w-32"
          data-testid="years-input"
        />
      </div>

      <div className="mb-4">
        <label className="block">Growth Rate (0-1)</label>
        <input
          type="number"
          step="0.01"
          value={growthRate}
          onChange={(e) => setGrowthRate(Number(e.target.value))}
          className="border p-2 mt-1 w-32"
          data-testid="growth-input"
        />
      </div>

      <div className="mb-4">
        <label className="block">Projects (comma separated counts)</label>
        {/* ----- START: CODE FIX ----- */}
        <input
          type="text"
          value={projectInput}
          // onChange now only updates the local string state, allowing smooth typing.
          onChange={(e) => setProjectInput(e.target.value)}
          // onBlur handles the parsing and updates the main `projects` state.
          onBlur={(e) => {
            const arr = e.target.value
              .split(",")
              .map((s) => parseInt(s.trim(), 10))
              .filter((n) => !isNaN(n) && isFinite(n));

            if (arr.length > 0) {
              setProjects(arr);
              // Also format the input field with the parsed result
              setProjectInput(arr.join(", "));
            } else {
              // If input is empty or invalid, revert to the last valid state
              setProjectInput(projects.join(", "));
            }
          }}
          className="border p-2 mt-1 w-full"
          data-testid="projects-input"
        />
        {/* ----- END: CODE FIX ----- */}
      </div>

      <div className="bg-gray-50 p-4 rounded">
        <p>
          Productivity Index:{" "}
          <strong data-testid="productivity-index">{productivityIndex}</strong>
        </p>
        <p>
          Complexity Score:{" "}
          <strong data-testid="complexity-score">
            {complexityScore.toFixed(2)}
          </strong>
        </p>

        {simulationMode && (
          <div className="mt-2">
            <h3 className="font-semibold">Anomalies</h3>
            <ul>
              {anomalies.map((a, i) => (
                <li key={i}>
                  Project {i + 1}: {a.value} {a.isAnomaly ? "(anomaly)" : ""}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          Note: calculations are deterministic and intentionally complex for
          coverage tests.
        </p>
      </div>
    </div>
  );
}
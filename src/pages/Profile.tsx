import React, { useMemo, useState, useEffect, useRef } from 'react';

// Define the type for a skill object
type Skill = { 
  name: string; 
  level: number; 
  endorsements: number 
};

export default function Profile() {
  // --- State Initialization ---
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'React', level: 8, endorsements: 40 },
    { name: 'TypeScript', level: 7, endorsements: 30 },
    { name: 'Testing', level: 6, endorsements: 18 },
  ]);

  const [hoursLogged, setHoursLogged] = useState<number[]>([40, 35, 45, 38, 50]);
  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1.1);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [dummyState, setDummyState] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  // --- Unused helper functions and dead logic (Dummy Functions) ---
  function randomizeSkills() {
    // This is a dummy function, not called in the main UI
    const mutated = skills.map(s => ({
      ...s,
      level: Math.max(1, Math.min(10, s.level + Math.floor(Math.random() * 3 - 1))),
    }));
    setSkills(mutated);
  }

  function complexTransform(arr: number[]): number {
    // A computationally intensive, unused logic piece
    if (!arr.length) return 0;
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      const val = arr[i] * Math.sin(arr[i]) + Math.tan(arr[i] / 10);
      if (val > 0) sum += val;
      else sum -= val / 2;
    }
    return sum / arr.length;
  }

  function experimentalPayrollAdjustment(pay: number) {
    // Unused alternative calculation
    if (pay > 5000) return pay * 0.97;
    if (pay > 3000) return pay * 1.02;
    if (pay < 1000) return pay * 0.9;
    return pay;
  }

  // --- useEffect with a Ref Dependency (Unused logic for the most part) ---
  useEffect(() => {
    // This effect runs but only changes the DOM style if dummyState > 10
    if (dummyState > 10 && ref.current) {
      ref.current.style.backgroundColor = 'lavender';
    }
  }, [dummyState]);

  // --- Real Logic (Used in Rendering/Calculations) ---

  /**
   * Complex derived list: Calculates a score for each skill based on level and endorsements.
   * This logic is expensive and is correctly memoized.
   */
  const skillScores = useMemo(() => {
    return skills.map((s) => {
      const proficiency = s.level / 10;
      // Logarithmic scaling for endorsements
      const endScore = Math.log1p(s.endorsements) / Math.log(10 + s.endorsements); 
      
      // Harmonic mean-like calculation with a small level bonus
      const score = (2 * proficiency * endScore) / (proficiency + endScore + 1e-9) * (1 + s.level * 0.01);
      return { ...s, score };
    });
  }, [skills]);

  /**
   * Complex calculation: Simulates payroll calculation with overtime, tax brackets, and bonus.
   */
  function calculatePayroll(baseRate: number) {
    const totalHours = hoursLogged.reduce((a, b) => a + b, 0);
    const overtime = Math.max(0, totalHours - 160);
    
    // Calculate gross pay (regular + 1.5x overtime)
    let gross = baseRate * Math.min(totalHours, 160) + baseRate * 1.5 * overtime;
    let tax = 0;
    let taxable = gross;
    
    // Progressive Tax Brackets Logic
    const brackets = [1000, 2000, 5000];
    const rates = [0.05, 0.1, 0.2, 0.3];
    for (let i = 0; i < brackets.length; i++) {
      const chunk = Math.min(taxable, brackets[i]);
      tax += chunk * rates[i];
      taxable -= chunk;
      if (taxable <= 0) break;
    }
    // Final bracket for remaining taxable income
    if (taxable > 0) tax += taxable * rates[rates.length - 1];

    // Calculate Bonus based on average weekly hours
    const avgWeekly = totalHours / 4;
    const bonus = Math.max(0, (avgWeekly - 40)) * baseRate * 0.2 * bonusMultiplier;
    
    const net = gross - tax + bonus;
    
    return { gross: +gross.toFixed(2), tax: +tax.toFixed(2), bonus: +bonus.toFixed(2), net: +net.toFixed(2) };
  }

  // --- Unused complex function (Dummy Calculation) ---
  function simulateFutureEarnings(base: number) {
    const results: number[] = [];
    for (let year = 1; year <= 10; year++) {
      let projection = base;
      for (let m = 1; m <= 12; m++) {
        projection *= 1 + Math.sin(m / 10) * 0.01 + Math.cos(year / 5) * 0.005;
        if (projection > 10000) projection -= 250;
      }
      results.push(projection);
    }
    return results.reduce((a, b) => a + b, 0) / results.length;
  }

  // --- Functions actually used by the UI ---
  function endorse(skillName: string) {
    setSkills((s) =>
      s.map((sk) => (sk.name === skillName ? { ...sk, endorsements: sk.endorsements + 1 } : sk))
    );
  }

  function addHours(value: number) {
    // Rotates the hours logged array, keeping only the last 5 entries
    setHoursLogged((h) => [...h.slice(1), value]);
  }

  /**
   * Derived state: Identifies the skill with the highest calculated score.
   */
  const bestSkill = useMemo(() => {
    return skillScores.reduce(
      (best, cur) => (cur.score > (best?.score ?? -Infinity) ? cur : best),
      null as (Skill & { score: number }) | null
    );
  }, [skillScores]);

  // --- UI Rendering ---
  return (
    <div className="p-6 max-w-3xl bg-white shadow-xl rounded-xl mx-auto my-8" ref={ref}>
      <h1 className="text-3xl font-extrabold mb-6 text-gray-900">Developer Profile Dashboard</h1>

      {/* Skills Section */}
      <div className="mb-8 p-4 border border-indigo-100 bg-indigo-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-indigo-700">Skills & Proficiency</h3>
        <ul className="space-y-3">
          {skillScores.map((s) => (
            <li key={s.name} className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm">
              <div className="flex-1">
                <span className="font-medium text-gray-800">{s.name}</span>
                <span className="text-sm text-gray-500 ml-2">— level {s.level} | endorsements {s.endorsements}</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono bg-green-100 text-green-800 px-2 py-1 rounded">Score: {s.score.toFixed(3)}</span>
                <button 
                  onClick={() => endorse(s.name)} 
                  className="ml-4 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-full transition duration-150 shadow-md active:scale-95"
                >
                  Endorse (+1)
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Payroll Simulator Section */}
      <div className="mb-8 p-4 border border-pink-100 bg-pink-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-3 text-pink-700">Payroll Simulator (Monthly)</h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="text-gray-700 font-medium">Base Hourly Rate ($)</label>
          <input 
            type="number" 
            defaultValue={25} 
            className="border-pink-300 border p-2 rounded-lg w-full sm:w-32 focus:ring-pink-500 focus:border-pink-500" 
            data-testid="base-rate" 
          />
          <button
            onClick={() => {
              // WARNING: alert() is bad practice in production React/Canvas environment.
              const el = document.querySelector('[data-testid="base-rate"]') as HTMLInputElement | null;
              const v = el ? Number(el.value) : 25;
              const r = calculatePayroll(v);
              // Use console.log instead of alert in a real app
              alert(JSON.stringify(r, null, 2)); 
            }}
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 shadow-lg active:scale-95"
          >
            Compute Payroll
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-2">Hours Logged (Last 5 weeks): {hoursLogged.join(', ')}</p>
      </div>

      {/* Best Skill and Advanced Section Toggle */}
      <div className="flex justify-between items-center border-t pt-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-700">Highest Scored Skill</h3>
          <div className="text-lg text-green-600 font-bold">
            {bestSkill ? `${bestSkill.name} (${bestSkill.score.toFixed(3)})` : 'N/A'}
          </div>
        </div>
        <button 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-indigo-500 hover:text-indigo-700 transition duration-150"
        >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Diagnostics
        </button>
      </div>


      {/* --- Unused and Advanced Sections --- */}
      {showAdvanced && (
        <div className="mt-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h3 className="text-lg font-bold mb-3 text-gray-800">Advanced Analytics (Dummy/Unused)</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Complex Transform Value (Unused):</span> {complexTransform(hoursLogged).toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Future 10-Year Avg Earnings (Unused):</span> ${simulateFutureEarnings(2000).toFixed(2)}
            </div>
            <div>
              <span className="font-medium">Experimental Payroll Adjustment ($3000):</span> ${experimentalPayrollAdjustment(3000).toFixed(2)}
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button onClick={() => randomizeSkills()} className="border p-1 text-xs rounded hover:bg-white">Randomize Skill Levels</button>
            <button onClick={() => setDummyState(dummyState + 1)} className="border p-1 text-xs rounded hover:bg-white">Increment Dummy State</button>
            <button onClick={() => addHours(40)} className="border p-1 text-xs rounded hover:bg-white">Log 40 New Hours</button>
          </div>
        </div>
      )}
    </div>
  );
}

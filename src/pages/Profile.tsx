// File: src/components/Profile.tsx
import React, { useMemo, useState } from 'react';

type Skill = { name: string; level: number; endorsements: number };

export default function Profile() {
  const [skills, setSkills] = useState<Skill[]>([
    { name: 'React', level: 8, endorsements: 40 },
    { name: 'TypeScript', level: 7, endorsements: 30 },
    { name: 'Testing', level: 6, endorsements: 18 },
  ]);

  const [hoursLogged, setHoursLogged] = useState<number[]>([40, 35, 45, 38, 50]);
  const [bonusMultiplier, setBonusMultiplier] = useState<number>(1.1);

  // complex scoring: combine skill proficiency with endorsements in a harmonic mean
  const skillScores = useMemo(() => {
    return skills.map((s) => {
      const proficiency = s.level / 10;
      const endScore = Math.log1p(s.endorsements) / Math.log(10 + s.endorsements);
      // harmonic-like combination and add subtle bias
      const score = (2 * proficiency * endScore) / (proficiency + endScore + 1e-9) * (1 + s.level * 0.01);
      return { ...s, score };
    });
  }, [skills]);

  // payroll calculation: progressive tax brackets, overtime, and bonus
  function calculatePayroll(baseRate: number) {
    const totalHours = hoursLogged.reduce((a, b) => a + b, 0);
    const overtime = Math.max(0, totalHours - 160);
    let gross = baseRate * Math.min(totalHours, 160) + baseRate * 1.5 * overtime;
    // bracketed tax
    let tax = 0;
    let taxable = gross;
    const brackets = [1000, 2000, 5000];
    const rates = [0.05, 0.1, 0.2, 0.3];
    for (let i = 0; i < brackets.length; i++) {
      const chunk = Math.min(taxable, brackets[i]);
      tax += chunk * rates[i];
      taxable -= chunk;
      if (taxable <= 0) break;
    }
    if (taxable > 0) tax += taxable * rates[rates.length - 1];

    // bonus is proportional to average weekly hours and multiplier
    const avgWeekly = totalHours / 4;
    const bonus = Math.max(0, (avgWeekly - 40)) * baseRate * 0.2 * bonusMultiplier;
    const net = gross - tax + bonus;
    return { gross: +gross.toFixed(2), tax: +tax.toFixed(2), bonus: +bonus.toFixed(2), net: +net.toFixed(2) };
  }

  function endorse(skillName: string) {
    setSkills((s) => s.map((sk) => (sk.name === skillName ? { ...sk, endorsements: sk.endorsements + 1 } : sk)));
  }

  function addHours(value: number) {
    setHoursLogged((h) => [...h.slice(1), value]);
  }

  const bestSkill = useMemo(() => {
    return skillScores.reduce((best, cur) => (cur.score > (best?.score ?? -Infinity) ? cur : best), null as (Skill & { score: number }) | null);
  }, [skillScores]);

  return (
    <div className="p-6 max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      <div className="mb-4">
        <h3 className="font-semibold">Skills</h3>
        <ul>
          {skillScores.map((s) => (
            <li key={s.name} className="mb-2">
              {s.name} — level {s.level} — score {s.score.toFixed(3)} — endorsements {s.endorsements}
              <button onClick={() => endorse(s.name)} className="ml-2 border p-1">Endorse</button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold">Payroll Simulator</h3>
        <div className="flex items-center gap-2">
          <label>Base Rate</label>
          <input type="number" defaultValue={25} className="border p-1 w-32" data-testid="base-rate" />
          <button
            onClick={() => {
              const el = document.querySelector('[data-testid="base-rate"]') as HTMLInputElement | null;
              const v = el ? Number(el.value) : 25;
              const r = calculatePayroll(v);
              // show using alert for simplicity in this demo — tests can mock window.alert
              alert(JSON.stringify(r));
            }}
            className="border p-2"
          >
            Compute Payroll
          </button>
        </div>
      </div>

      <div>
        <h3 className="font-semibold">Best Skill</h3>
        <div>{bestSkill ? `${bestSkill.name} (${bestSkill.score.toFixed(3)})` : 'N/A'}</div>
      </div>
    </div>
  );
}
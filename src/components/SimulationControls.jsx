import React from 'react';

export default function SimulationControls({ currentMode, onChangeMode }) {
  const modes = [
    { id: 'normal', label: 'Normal Sinus', color: 'bg-emerald-600', description: 'HR 72, regular rhythm' },
    { id: 'bradycardia', label: 'Bradycardia', color: 'bg-yellow-600', description: 'HR 45, slow but regular' },
    { id: 'tachycardia', label: 'Tachycardia', color: 'bg-orange-600', description: 'HR 135, fast but regular' },
    { id: 'afib', label: 'Atrial Fibrillation', color: 'bg-red-600', description: 'HR 80, irregularly irregular' },
    { id: 'vtach', label: 'Ventricular Tachycardia', color: 'bg-purple-600', description: 'HR 180, wide complexes' },
  ];

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
      <h3 className="text-sm font-bold text-slate-300 mb-3 uppercase tracking-wide">🔬 Simulation Mode</h3>
      <div className="flex flex-wrap gap-2">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onChangeMode(mode.id)}
            className={`px-3 py-2 rounded text-xs font-medium transition ${
              currentMode === mode.id
                ? `${mode.color} text-white ring-2 ring-white`
                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-2">
        {modes.find(m => m.id === currentMode)?.description}
      </p>
    </div>
  );
}
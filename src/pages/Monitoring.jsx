import React, { useState } from 'react';
import { usePatients } from '../context/PatientContext.jsx';
import { useSimulatedVitals } from '../hooks/useSimulatedVitals.js';
import ECGCanvas from '../components/ECGCanvas.jsx';
import SimulationControls from '../components/SimulationControls.jsx';

export default function Monitoring() {
  const { selectedPatient, patients, setSelectedPatient } = usePatients();
  const { vitals, mode, changeMode } = useSimulatedVitals('normal');
  const [activeTab, setActiveTab] = useState('Vital signs');
  const tabs = ['Vital signs', 'Raw Data', "Patient's Notes", 'Medical Record', 'Personal Info', 'Sessions', 'Home'];

  const patient = selectedPatient || patients?.[0] || {
    name: 'No Patient',
    mrn: '—',
    age: '—',
    dept: '—',
    status: 'active'
  };

  const abnormal = vitals.pulse > 100 || vitals.pulse < 60 || vitals.spo2 < 90 || vitals.temp > 37.5;

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-slate-100">
      <header className="bg-gradient-to-r from-blue-800 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">W</div>
            <div>
              <h1 className="text-lg font-bold">Wireless Emergency Telemedicine System</h1>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider">Remote Healthcare Monitoring</p>
            </div>
          </div>
          {abnormal && <span className="bg-red-600 text-white text-xs px-3 py-1 rounded animate-pulse">⚠ ABNORMAL VITALS</span>}
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-2 flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)} className={`px-4 py-1.5 text-xs rounded-t font-medium transition ${activeTab === t ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>{t}</button>
          ))}
        </div>
      </header>

      <main className="flex-grow p-4 max-w-7xl mx-auto w-full space-y-4">
        <SimulationControls currentMode={mode} onChangeMode={changeMode} />

        <div className="bg-slate-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-2xl">👤</div>
            <div className="text-sm space-y-1">
              <p><span className="text-slate-400">Patient:</span> <span className="font-semibold">{patient.name}</span></p>
              <p><span className="text-slate-400">MRN:</span> {patient.mrn || '—'}</p>
              <p><span className="text-slate-400">Age:</span> {patient.age || '—'}</p>
              <p><span className="text-slate-400">Status:</span> <span className={`font-semibold ${patient.status === 'critical' ? 'text-red-400' : 'text-emerald-400'}`}>{patient.status || '—'}</span></p>
            </div>
          </div>
          
          <div className="md:ml-auto">
            <label className="text-xs text-slate-400 block mb-1">Switch Patient</label>
            <select 
              value={patient.id || ''} 
              onChange={(e) => {
                const p = patients?.find(x => x.id === Number(e.target.value));
                if (p) setSelectedPatient(p);
              }}
              className="bg-slate-700 text-white text-xs rounded px-3 py-2 border border-slate-600"
            >
              {patients?.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
              )) || <option>No patients</option>}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VitalCard label="Pulse (bpm)" value={vitals.pulse} color={vitals.pulse > 100 || vitals.pulse < 60 ? 'text-red-400' : 'text-white'} />
          <VitalCard label="BP (mmHg)" value={`${vitals.sys}/${vitals.dia}`} color={vitals.sys > 140 ? 'text-red-400' : 'text-white'} />
          <VitalCard label="Temp (°C)" value={vitals.temp} color={vitals.temp > 37.5 ? 'text-red-400' : 'text-amber-400'} />
          <VitalCard label="SpO2 (%)" value={vitals.spo2} color={vitals.spo2 < 90 ? 'text-red-400' : 'text-orange-400'} />
        </div>

        <div className="bg-black rounded-lg border border-slate-700 p-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs text-slate-400">ECG Waveform — {vitals.pulse} bpm ({mode})</h4>
            <span className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              LIVE
            </span>
          </div>
          <ECGCanvas pulse={vitals.pulse} mode={mode} />
        </div>
      </main>

      <footer className="bg-slate-800 text-center text-[10px] text-slate-500 py-2 border-t border-slate-700">
        Developed in EE Department, Faculty of Engineering, Assiut University
      </footer>
    </div>
  );
}

function VitalCard({ label, value, color }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color || 'text-white'}`}>{value ?? '--'}</p>
    </div>
  );
}
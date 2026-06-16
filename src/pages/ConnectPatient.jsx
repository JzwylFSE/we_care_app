import React, { useState } from "react";
import { usePatients } from "../context/PatientContext.jsx";
import { useVitals } from "../hooks/useVitals.js";
import ECGCanvas from "../components/ECGCanvas.jsx";

export default function ConnectPatient() {
  const { patients, selectedPatient, setSelectedPatient } = usePatients();
  const vitals = useVitals();
  const [connType, setConnType] = useState("patient name");

  const handleConnect = () => {
    // In a real app this would search. Here we just keep the selected one.
    alert(`Connected to ${selectedPatient?.name || "patient"}`);
  };

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <header className="bg-linear-to-r from-blue-700 to-sky-500 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-wide">
              Wireless Emergency Telemedicine System
            </h1>
            <p className="text-xs opacity-90">Remote Healthcare Monitoring</p>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold text-xs text-center leading-tight">
            We
            <br />
            Care
          </div>
        </div>
      </header>

      <main className="grow p-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <h2 className="text-lg font-bold text-red-600">Connect to Patient</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-red-500 mb-4 uppercase tracking-wide">
                Patient Waveforms
              </h3>
              <div className="bg-black rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-400 mb-2">
                  ECG Waveform — Live
                </p>
                <ECGCanvas />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-4 py-2 rounded transition">
                  plot
                </button>
                <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-4 py-2 rounded transition">
                  UDP
                </button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium px-4 py-2 rounded transition">
                  ON
                </button>
                <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-2 rounded transition">
                  OFF
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <h3 className="text-sm font-bold text-red-500 mb-4 uppercase tracking-wide">
                  Vital Signs
                </h3>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 mb-1">
                      Temperature (°C)
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {vitals.temp}
                    </p>
                  </div>
                  <div className="text-center border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 mb-1">
                      Heart Rate (bpm)
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {vitals.pulse}
                    </p>
                  </div>
                  <div className="text-center border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 mb-1">SPO2(%)</p>
                    <p className="text-2xl font-bold text-slate-800">
                      {vitals.spo2}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 mb-1">
                      Blood Pressure (mmHg)
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {vitals.sys}/{vitals.dia}
                    </p>
                  </div>
                  <div className="text-center border border-slate-200 rounded-lg p-3">
                    <p className="text-[10px] text-slate-500 mb-1">
                      Respiration (breath/min)
                    </p>
                    <p className="text-2xl font-bold text-slate-800">
                      {vitals.resp}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                <h3 className="text-sm font-bold text-red-500 mb-4 uppercase tracking-wide">
                  Connect
                </h3>
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <label className="text-sm text-slate-600 w-28">
                      Connection Type:
                    </label>
                    <select
                      value={connType}
                      onChange={(e) => setConnType(e.target.value)}
                      className="border border-slate-300 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option>patient name</option>
                      <option>patient ID</option>
                    </select>
                    <button
                      onClick={handleConnect}
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded transition"
                    >
                      Connect
                    </button>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                    <label className="text-sm text-slate-600 w-28">
                      Patient
                    </label>
                    <select
                      value={selectedPatient?.id || ""}
                      onChange={(e) => {
                        const p = patients.find(
                          (x) => x.id === Number(e.target.value),
                        );
                        if (p) setSelectedPatient(p);
                      }}
                      className="border border-slate-300 rounded-md px-3 py-2 text-sm w-full sm:w-64 bg-white"
                    >
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({p.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 justify-end">
                  <button className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium px-4 py-2 rounded transition">
                    Save
                  </button>
                  <button className="bg-amber-400 hover:bg-amber-500 text-white text-xs font-medium px-4 py-2 rounded transition">
                    Pause
                  </button>
                  <button className="bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-4 py-2 rounded transition">
                    Stop
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-slate-200 text-center text-xs text-slate-600 py-3">
        Developed in Computer Science Department, Faculty of Science, Rivers
        State University
      </footer>
    </div>
  );
}

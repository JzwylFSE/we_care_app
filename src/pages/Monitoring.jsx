import React, { useState } from "react";
import { usePatients } from "../context/PatientContext.jsx";
import { useVitals } from "../hooks/useVitals.js";
import ECGCanvas from "../components/ECGCanvas.jsx";
import { supabase } from "../supabaseClient.js"; // Import the client
import { useRef } from "react";

export default function Monitoring() {
  const { selectedPatient } = usePatients();
  const ecgRef = useRef(null);

  // 1. Track whether the ECG animation is running
  const [isEcgRunning, setIsEcgRunning] = useState(true);

  // Pass the patient ID so the hook knows WHOSE vitals to fetch/listen to
  const vitals = useVitals(selectedPatient?.id);

  const [activeTab, setActiveTab] = useState("Vital signs");
  const [isSaving, setIsSaving] = useState(false);
  const tabs = [
    "Vital signs",
    "Raw Data",
    "Patient's Notes",
    "Medical Record",
    "Personal Info",
    "Sessions",
    "Home",
  ];

  // Determine if current readings are dangerous
  const abnormal =
    vitals.pulse > 100 ||
    vitals.pulse < 60 ||
    vitals.spo2 < 90 ||
    vitals.temp > 37.5;

  // Supabase Integration: Save a snapshot of current vitals to the database
  const handleSaveSnapshot = async () => {
    if (!selectedPatient?.id) {
      alert("No patient selected.");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Insert into the vitals table
      const { error: vitalsError } = await supabase.from("vitals").insert({
        patient_id: selectedPatient.id,
        pulse: vitals.pulse,
        blood_pressure_sys: vitals.sys,
        blood_pressure_dia: vitals.dia,
        temperature: vitals.temp,
        spo2: vitals.spo2,
        source_device: "Web Dashboard Manual Snapshot",
      });

      if (vitalsError) throw vitalsError;

      // 2. If vitals are abnormal, automatically log an alert in the alerts table
      if (abnormal) {
        const { error: alertError } = await supabase.from("alerts").insert({
          patient_id: selectedPatient.id,
          type: "Abnormal Vitals Snapshot",
          severity: "High",
          message: `Pulse: ${vitals.pulse}, SPO2: ${vitals.spo2}%, Temp: ${vitals.temp}°C`,
        });

        if (alertError) throw alertError;
      }

      alert("Vitals snapshot saved successfully to the database!");
    } catch (err) {
      console.error("Error saving snapshot:", err.message);
      alert(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-slate-900 min-h-screen flex flex-col text-slate-100">
      <header className="bg-linear-to-r from-blue-800 to-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-800 font-bold text-sm">
              W
            </div>
            <div>
              <h1 className="text-lg font-bold">
                Wireless Emergency Telemedicine System
              </h1>
              <p className="text-[10px] text-slate-300 uppercase tracking-wider">
                Remote Healthcare Monitoring
              </p>
            </div>
          </div>
          {abnormal && (
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded animate-pulse">
              ⚠ ABNORMAL VITALS
            </span>
          )}
        </div>
        <div className="max-w-7xl mx-auto px-4 pb-2 flex flex-wrap gap-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-1.5 text-xs rounded-t font-medium transition ${activeTab === t ? "bg-slate-700 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <main className="grow p-4 max-w-7xl mx-auto w-full space-y-4">
        <div className="bg-slate-800 rounded-lg p-4 flex flex-col md:flex-row gap-4 items-start md:items-center border border-slate-700">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-600 rounded-lg flex items-center justify-center text-2xl">
              &#128100;
            </div>
            <div className="text-sm space-y-1">
              <p>
                <span className="text-slate-400">Patient:</span>{" "}
                <span className="font-semibold">
                  {selectedPatient?.name || "None selected"}
                </span>
              </p>
              <p>
                <span className="text-slate-400">MRN:</span>{" "}
                {selectedPatient?.mrn || "—"}
              </p>
              <p>
                <span className="text-slate-400">Age:</span>{" "}
                {selectedPatient?.age || "—"}
              </p>
              <p>
                <span className="text-slate-400">Current state:</span>{" "}
                <span className="text-emerald-400 font-semibold">
                  {selectedPatient?.status || "—"}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VitalCard
            label="Pulse (bpm)"
            value={vitals.pulse}
            color={
              vitals.pulse > 100 || vitals.pulse < 60
                ? "text-red-400"
                : "text-white"
            }
            icon="&#9829;"
          />
          <VitalCard
            label="Blood Pressure"
            value={`${vitals.sys}/${vitals.dia}`}
            sub="mmHg"
            color="text-white"
          />
          <VitalCard
            label="Temperature (°C)"
            value={vitals.temp}
            color={vitals.temp > 37.5 ? "text-red-400" : "text-amber-400"}
          />
          <VitalCard
            label="SPO2 (%)"
            value={vitals.spo2}
            color={vitals.spo2 < 90 ? "text-red-400" : "text-orange-400"}
          />
        </div>

        <div className="bg-black rounded-lg border border-slate-700 p-4">
          <h4 className="text-xs text-slate-400 mb-2">ECG Waveform — Live</h4>
          {/* Pass the selectedPatient.id and running state to ECGCanvas */}
          <ECGCanvas
            patientId={selectedPatient?.id}
            ref={ecgRef}
            isRunning={isEcgRunning}
          />

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            {["Load", "Save", "Pause", "Stop", "UDP", "Connect"].map((b) => {
              const handleClick = () => {
                if (b === "Save") return handleSaveSnapshot();
                if (b === "Pause" || b === "Stop")
                  return setIsEcgRunning(false);
                if (b === "Connect" || b === "UDP")
                  return setIsEcgRunning(true);
                if (b === "Load")
                  return alert("Loading past ECG data from Supabase...");
              };

              return (
                <button
                  key={b}
                  onClick={handleClick}
                  disabled={b === "Save" && isSaving}
                  className={`text-xs px-4 py-1.5 rounded text-white transition ${
                    b === "Pause"
                      ? "bg-amber-600 hover:bg-amber-500"
                      : b === "Stop"
                        ? "bg-red-600 hover:bg-red-500"
                        : b === "Connect"
                          ? "bg-emerald-600 hover:bg-emerald-500"
                          : b === "Save" && isSaving
                            ? "bg-slate-500 cursor-not-allowed"
                            : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {b === "Save" && isSaving ? "Saving..." : b}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      <footer className="bg-slate-800 text-center text-[10px] text-slate-500 py-2 border-t border-slate-700">
        Developed in Computer Science Department, Faculty of Science, Rivers
        State University
      </footer>
    </div>
  );
}

function VitalCard({ label, value, color, sub, icon }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value || "--"}</p>
      {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
      {icon && (
        <div
          className="text-red-500 mt-1 text-lg"
          dangerouslySetInnerHTML={{ __html: icon }}
        />
      )}
    </div>
  );
}

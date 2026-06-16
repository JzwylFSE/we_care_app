import React, { useState } from "react";
import { usePatients } from "../context/PatientContext.jsx";
import { useNavigate } from "react-router-dom";

export default function AddPatient() {
  const { addPatient } = usePatients();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false); // Added to prevent double-clicks

  const [form, setForm] = useState({
    name: "",
    age: "",
    dept: "internists",
    mrn: "",
    gender: "Male",
    blood: "O-",
    doctor: "DR.Mohamed",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!form.name || !form.age) {
      alert("Name and Age are required");
      return;
    }

    setIsSubmitting(true);

    // Map the form state to the exact Supabase database columns
    const result = await addPatient({
      name: form.name,
      age: Number(form.age),
      dept: form.dept,
      mrn: form.mrn || "08050852601" + Math.floor(Math.random() * 999),
      gender: form.gender,
      blood_type: form.blood, // Mapped to schema
      assigned_doctor: form.doctor, // Mapped to schema
      phone: form.phone,
      email: form.email,
      address: form.address,
      status: "stable", // Default status
    });

    setIsSubmitting(false);

    // Check the success response from our Supabase-powered Context
    if (result.success) {
      alert("Patient saved!");
      navigate("/search");
    } else {
      alert(`Error saving patient: ${result.error}`);
    }
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
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 font-bold">
            W
          </div>
        </div>
      </header>

      <main className="grow p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab("personal")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === "personal" ? "text-blue-700 border-blue-600 bg-white" : "text-slate-500 border-transparent"}`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab("contact")}
              className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === "contact" ? "text-blue-700 border-blue-600 bg-white" : "text-slate-500 border-transparent"}`}
            >
              Contact Person
            </button>
          </div>

          {activeTab === "personal" ? (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  First Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Age
                </label>
                <input
                  name="age"
                  type="number"
                  value={form.age}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Department
                </label>
                <select
                  name="dept"
                  value={form.dept}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>Internists</option>
                  <option>Cardiology</option>
                  <option>Orthopedics</option>
                  <option>Neurology</option>
                  <option>Gynecology</option>
                  <option>Pediatrics</option>
                  <option>Surgeons</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  MRN
                </label>
                <input
                  name="mrn"
                  value={form.mrn}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  placeholder="Auto-generated if empty"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Blood Type
                </label>
                <select
                  name="blood"
                  value={form.blood}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>O-</option>
                  <option>A+</option>
                  <option>B+</option>
                  <option>AB+</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Doctor
                </label>
                <select
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                >
                  <option>Dr. Jah'swill</option>
                  <option>Dr. Chibuokem</option>
                  <option>Dr. Trotsky</option>
                  <option>Dr. Chisom</option>
                  <option>Dr. Kelvin</option>
                  <option>Dr. Joshua</option>
                  <option>Dr. Jaspha</option>
                  <option>Dr. Ekene</option>
                  <option>Dr. Efe</option>
                  <option>Dr. MiiLy</option>
                  <option>Dr. Yaphany</option>
                  <option>Dr. Daniel</option>
                  <option>Dr. ABC</option>
                  <option>Dr. Ibitimi</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 text-sm"
                />
              </div>
            </div>
          ) : (
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Emergency Contact Name
                </label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Relationship
                </label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Phone
                </label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Address
                </label>
                <input className="w-full border rounded-md px-3 py-2 text-sm" />
              </div>
            </div>
          )}

          <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-center gap-4">
            <button
              onClick={() => setForm({})}
              className="bg-slate-300 hover:bg-slate-400 text-slate-700 font-medium px-8 py-2 rounded-lg transition"
              disabled={isSubmitting}
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className={`${isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white font-medium px-8 py-2 rounded-lg transition`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </main>

      <footer className="bg-slate-200 text-center text-xs text-slate-600 py-3">
        Developed in Computer Science Department, Faculty of Science, Rivers
        State University, June 2013
      </footer>
    </div>
  );
}

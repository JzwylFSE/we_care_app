import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function MainMenu() {
  const { user } = useAuth();

  const menuItems = [
    {
      title: "New Patient",
      color: "border-blue-500",
      bg: "bg-blue-50",
      hover: "group-hover:bg-blue-100",
      iconColor: "text-blue-600",
      path: "/add",
    },
    {
      title: "Find Patient",
      color: "border-sky-500",
      bg: "bg-sky-50",
      hover: "group-hover:bg-sky-100",
      iconColor: "text-sky-600",
      path: "/search",
    },
    {
      title: "Patient Connection",
      color: "border-emerald-500",
      bg: "bg-emerald-50",
      hover: "group-hover:bg-emerald-100",
      iconColor: "text-emerald-600",
      path: "/connect",
    },
    {
      title: "Monitoring",
      color: "border-teal-500",
      bg: "bg-teal-50",
      hover: "group-hover:bg-teal-100",
      iconColor: "text-teal-600",
      path: "/monitor",
    },
  ];

  return (
    <div className="bg-slate-100 min-h-screen flex flex-col">
      <main className="grow flex flex-col items-center justify-center p-6">
        <div className="text-center mb-8">
          <p className="text-sm text-slate-500 mb-2">
            Logged in as{" "}
            <span className="font-semibold text-blue-700">{user?.name}</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2">
            <span className="text-blue-700">Wireless</span>{" "}
            <span className="text-red-600">Emergency</span>{" "}
            <span className="text-slate-700">Telemedicine</span>{" "}
            <span className="text-blue-700">System</span>
          </h1>
          <p className="text-slate-400 text-lg tracking-widest uppercase">
            Remote Healthcare Monitoring
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {menuItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={`bg-white rounded-xl shadow-md hover:shadow-xl transition p-6 flex flex-col items-center border-t-4 ${item.color} group`}
            >
              <div
                className={`w-16 h-16 ${item.bg} rounded-full flex items-center justify-center mb-4 ${item.hover} transition`}
              >
                <svg
                  className={`w-8 h-8 ${item.iconColor}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                  />
                </svg>
              </div>
              <span className="font-semibold text-slate-700">{item.title}</span>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-slate-200 text-center text-xs text-slate-600 py-3">
        Developed in Computer Science Department, Faculty of Science, Rivers
        State University
      </footer>
    </div>
  );
}

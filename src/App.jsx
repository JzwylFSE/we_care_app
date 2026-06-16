import { HashRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext.jsx";
import { PatientProvider } from "./context/PatientContext.jsx"; // Import the Provider!

import Login from "./pages/Login";
import MainMenu from "./pages/MainMenu";
import SearchPatients from "./pages/SearchPatients";
import AddPatient from "./pages/AddPatient";
import Monitoring from "./pages/Monitoring";
import ConnectPatient from "./pages/ConnectPatient";
import PatientsDirectory from "./components/PatientsDirectory";

export default function App() {
  const { user, logout, loading } = useAuth();

  // 1. Show a loading screen while Supabase verifies the secure session
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 text-sm tracking-widest uppercase">Verifying Security...</p>
      </div>
    );
  }

  return (
    <HashRouter>
      {/* Show Nav ONLY if user is logged in */}
      {user && (
        <nav className="bg-slate-800 text-white text-xs p-2 flex gap-3 sticky top-0 z-50 items-center">
          <Link to="/main" className="hover:underline">Main</Link>
          <Link to="/search" className="hover:underline">Search</Link>
          <Link to="/add" className="hover:underline">Add Patient</Link>
          <Link to="/monitor" className="hover:underline">Monitor</Link>
          <Link to="/connect" className="hover:underline">Connect</Link>
          <Link to="/directory" className="hover:underline">Directory</Link>
          <span className="ml-auto flex items-center gap-2">
            <span className="text-emerald-400">● {user.name}</span>
            <button
              onClick={logout}
              className="bg-red-600 px-2 py-1 rounded hover:bg-red-500 transition"
            >
              Logout
            </button>
          </span>
        </nav>
      )}

      {/* Conditional Routing: 
        If the user exists, render the PatientProvider and the private routes.
        If no user exists, ONLY render the Login route.
      */}
      {user ? (
        <PatientProvider>
          <Routes>
            {/* Redirect logged-in users away from the login page */}
            <Route path="/" element={<Navigate to="/main" replace />} />
            
            <Route path="/main" element={<MainMenu />} />
            <Route path="/search" element={<SearchPatients />} />
            <Route path="/add" element={<AddPatient />} />
            <Route path="/monitor" element={<Monitoring />} />
            <Route path="/connect" element={<ConnectPatient />} />
            <Route path="/directory" element={<PatientsDirectory />} />
            
            {/* Catch any weird URLs and send them to the main menu */}
            <Route path="*" element={<Navigate to="/main" replace />} />
          </Routes>
        </PatientProvider>
      ) : (
        <Routes>
          <Route path="/" element={<Login />} />
          {/* If a logged-out user tries to access /search, force them to login */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      )}
    </HashRouter>
  );
}
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Ensure this points to your client file

const PatientContext = createContext(null);

export function PatientProvider({ children }) {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Keep the selected patient in localStorage for good UX during page reloads
  const [selectedPatient, setSelectedPatient] = useState(() => {
    const saved = localStorage.getItem('wets_selected');
    return saved ? JSON.parse(saved) : null;
  });

  // Persist selected patient to local storage whenever it changes
  useEffect(() => {
    if (selectedPatient) {
      localStorage.setItem('wets_selected', JSON.stringify(selectedPatient));
    } else {
      localStorage.removeItem('wets_selected');
    }
  }, [selectedPatient]);

  // Fetch live patients from Supabase on mount
  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setPatients(data || []);

      // Optional: Automatically select the first patient if none is currently selected
      if (data && data.length > 0 && !localStorage.getItem('wets_selected')) {
        setSelectedPatient(data[0]);
      }
    } catch (err) {
      console.error('Error fetching patients:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData) => {
    try {
      // Supabase handles the UUID creation automatically, so we no longer need Math.max()
      const { data, error } = await supabase
        .from('patients')
        .insert([{ ...patientData, status: patientData.status || 'stable' }])
        .select()
        .single(); // Returns just the newly created object

      if (error) throw error;

      // Update the local state instantly without needing to reload the page
      setPatients((prevPatients) => [data, ...prevPatients]);
      return { success: true, data };
    } catch (err) {
      console.error('Error adding patient:', err.message);
      return { success: false, error: err.message };
    }
  };

  const deletePatient = async (id) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local UI
      setPatients((prevPatients) => prevPatients.filter(p => p.id !== id));
      
      // Clear the selection if the deleted patient was currently selected
      if (selectedPatient?.id === id) {
        setSelectedPatient(null);
      }
      return { success: true };
    } catch (err) {
      console.error('Error deleting patient:', err.message);
      return { success: false, error: err.message };
    }
  };

  return (
    <PatientContext.Provider 
      value={{ 
        patients, 
        selectedPatient, 
        setSelectedPatient, 
        addPatient, 
        deletePatient,
        loading,
        error,
        refreshPatients: fetchPatients // Exposed just in case you need to force a manual refresh
      }}
    >
      {children}
    </PatientContext.Provider>
  );
}

export const usePatients = () => useContext(PatientContext);
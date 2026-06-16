import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export function useVitals(patientId) {
  const [vitals, setVitals] = useState({
    pulse: '--',
    sys: 120, // Default fallbacks so the UI doesn't look empty
    dia: 80,
    temp: 36.8,
    spo2: '--',
    resp: 16,
  });

  useEffect(() => {
    if (!patientId) return;

    console.log(`📡 Hooked into patient: ${patientId}`);

    // 1. Fetch the absolute latest vitals on load
    const fetchLatestVitals = async () => {
      try {
        const { data, error } = await supabase
          .from('vitals')
          .select('*')
          .eq('patient_id', patientId)
          .order('measured_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        if (data) updateVitalsState(data);
      } catch (err) {
        console.error('Error fetching initial vitals:', err.message);
      }
    };

    fetchLatestVitals();

    // 2. Subscribe to LIVE WebSocket updates
    const channel = supabase
      .channel(`vitals-updates-${patientId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'vitals',
          filter: `patient_id=eq.${patientId}` 
        },
        (payload) => {
          // You should see this in your browser's Developer Tools (F12)
          console.log('⚡ LIVE DATA RECEIVED:', payload.new);
          updateVitalsState(payload.new);
        }
      )
      .subscribe((status) => {
        console.log(`🔌 Supabase Realtime Status: ${status}`);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [patientId]);

  // Safely merge new database rows with existing state
  const updateVitalsState = (dbRow) => {
    setVitals((prev) => ({
      // If the database row has a value, use it. Otherwise, keep whatever was already on screen.
      pulse: dbRow.pulse !== null ? dbRow.pulse : prev.pulse,
      sys: dbRow.blood_pressure_sys !== null ? dbRow.blood_pressure_sys : prev.sys,
      dia: dbRow.blood_pressure_dia !== null ? dbRow.blood_pressure_dia : prev.dia,
      temp: dbRow.temperature !== null ? dbRow.temperature : prev.temp,
      spo2: dbRow.spo2 !== null ? dbRow.spo2 : prev.spo2,
      resp: dbRow.respiratory_rate !== null ? dbRow.respiratory_rate : prev.resp,
    }));
  };

  return vitals;
}
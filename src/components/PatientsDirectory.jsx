// src/components/PatientsDirectory.jsx
import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function PatientsDirectory() {
  // 1. Set up state to hold our data, loading status, and errors
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 2. Use useEffect to run this code as soon as the component loads
  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true)
        // Fetch data from your 'patients' table
        const { data, error } = await supabase
          .from('patients')
          .select('id, first_name, last_name, room_number, admission_date')
          .order('admission_date', { ascending: false })

        if (error) throw error
        
        // If successful, save the data to state
        setPatients(data)
      } catch (error) {
        console.error('Error fetching patients:', error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, []) // The empty array ensures this only runs once when the component mounts

  // 3. Render the UI based on the current state
  if (loading) {
    return <div className="p-8 text-gray-500">Loading patient records...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600 bg-red-50">Error: {error}</div>
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Patient Directory</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Room</th>
              <th className="py-3 px-4 text-left">Admission Date</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  {patient.first_name} {patient.last_name}
                </td>
                <td className="py-3 px-4 font-mono">{patient.room_number}</td>
                <td className="py-3 px-4 text-gray-600">
                  {new Date(patient.admission_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
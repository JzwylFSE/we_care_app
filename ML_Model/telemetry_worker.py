import os
import time
import random
from datetime import datetime
from supabase import create_client, Client

# Load environment variables from a local .env file in ML_Model (optional)
try:
    from dotenv import load_dotenv
except Exception:
    load_dotenv = None

# ==========================================
# 1. SUPABASE CONFIGURATION (from env)
# ==========================================
# Place a `.env` file next to this script with the variables below, or set them in your environment.
env_path = os.path.join(os.path.dirname(__file__), ".env")
if load_dotenv and os.path.exists(env_path):
    load_dotenv(env_path)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Optional: a default patient id for local testing. Prefer setting PATIENT_ID in .env.
PATIENT_ID = os.getenv("PATIENT_ID")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set in ML_Model/.env or environment variables.")
    raise SystemExit(1)

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# ==========================================
# 2. AI MODEL INTEGRATION (Simulated for testing)
# ==========================================
# In production, you would import your UniversalSeverityEngine from your notebook here.
# For now, we simulate the output of engine.evaluate() to test the database pipeline.

def mock_ai_evaluation():
    """Simulates the AI reading the ECG/PPG and returning a TriageResult"""
    
    # 80% chance of normal, 20% chance of a critical AFib/Tachycardia event
    is_critical = random.random() > 0.8 
    
    if is_critical:
        heart_rate = random.randint(115, 140)
        spo2 = random.uniform(88.0, 93.0)
        rhythm = "AFib"
        requires_escalation = True
        reason = f"High-confidence AFib detected. HR: {heart_rate}, SpO2: {spo2:.1f}%"
    else:
        heart_rate = random.randint(65, 85)
        spo2 = random.uniform(96.0, 99.0)
        rhythm = "Normal"
        requires_escalation = False
        reason = ""

    return {
        "heart_rate": heart_rate,
        "spo2": spo2,
        "rhythm_label": rhythm,
        "requires_escalation": requires_escalation,
        "escalation_reason": reason,
        "timestamp": datetime.now().isoformat()
    }

# ==========================================
# 3. CONTINUOUS MONITORING LOOP
# ==========================================
def run_telemetry_loop(interval_sec=5):
    print(f"📡 Starting Telemetry Worker for Patient: {PATIENT_ID}")
    print("Connecting to Supabase...")
    
    try:
        while True:
            # 1. AI evaluates the current electrical signals
            result = mock_ai_evaluation()
            print(f"\n[{result['timestamp']}] Evaluated: HR={result['heart_rate']}, SpO2={result['spo2']:.1f}% ({result['rhythm_label']})")
            
            # 2. Push standard vitals to Supabase
            # Because you enabled Realtime in Supabase, this INSERT instantly updates your React frontend!
            vitals_data = {
                "patient_id": PATIENT_ID,
                "pulse": result["heart_rate"],
                "spo2": int(result["spo2"]),
                "source_device": "AI Telemetry Worker (Python)"
            }
            supabase.table("vitals").insert(vitals_data).execute()
            print("  ✅ Vitals pushed to database.")

            # 3. If AI flags RED severity, push to Alerts table
            if result["requires_escalation"]:
                print("  🚨 CRITICAL EVENT DETECTED! Pushing to Alerts table...")
                alert_data = {
                    "patient_id": PATIENT_ID,
                    "type": result["rhythm_label"],
                    "severity": "High",
                    "message": result["escalation_reason"]
                }
                supabase.table("alerts").insert(alert_data).execute()
                
                # Here is where you would also trigger the Twilio SMS from your notebook
                print("  ✅ Alert dispatched.")

            # Wait before the next reading
            time.sleep(interval_sec)

    except KeyboardInterrupt:
        print("\n🛑 Telemetry Worker stopped.")
    except Exception as e:
        print(f"\n❌ Error connecting to database: {e}")

if __name__ == "__main__":
    run_telemetry_loop(interval_sec=5) # Sends a new reading every 5 seconds
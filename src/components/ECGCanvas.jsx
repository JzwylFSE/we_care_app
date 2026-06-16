import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { supabase } from "../supabaseClient";

const ECGCanvas = forwardRef(({ patientId, isRunning = true }, ref) => {
  const canvasRef = useRef(null);

  // We use a ref to silently track the live array without triggering React re-renders
  const liveDataRef = useRef([]);

  // Expose a function to the parent component to save the current waveform
  useImperativeHandle(ref, () => ({
    saveWaveformToDatabase: async () => {
      if (!patientId) throw new Error("No patient selected for ECG recording.");
      if (liveDataRef.current.length === 0)
        throw new Error("No ECG data to save.");

      // Push the raw array of coordinates to Supabase
      const { error } = await supabase.from("ecg_records").insert({
        patient_id: patientId,
        sample_rate: 60, // Approximating 60 frames per second
        lead_type: "Lead II (Simulated)",
        waveform_data: liveDataRef.current,
      });

      if (error) throw error;
      return true;
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;
    const data = [];
    const speed = 2;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = canvas.width = rect.width;
      h = canvas.height = rect.height;
      while (data.length < w / speed) data.push(h / 2);
    };

    resize();
    window.addEventListener("resize", resize);

    const baseline = () => h / 2;

    const getECGValue = () => {
      const cycle = (Date.now() % 1200) / 1200;
      const b = baseline();
      if (cycle > 0.15 && cycle < 0.2) return b - 30;
      if (cycle > 0.22 && cycle < 0.25) return b + 15;
      if (cycle > 0.25 && cycle < 0.3) return b - 70;
      if (cycle > 0.3 && cycle < 0.35) return b + 25;
      if (cycle > 0.5 && cycle < 0.7) return b - 20;
      return b + (Math.random() - 0.5) * 3;
    };

    let animationFrameId;

    const draw = () => {
      // Only draw when `isRunning` is true
      if (!isRunning) return;

      data.shift();
      data.push(getECGValue());

      // Sync the local animation array with our React ref so it can be saved
      liveDataRef.current = data;

      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = "#1e293b";
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.stroke();
      }
      for (let i = 0; i < h; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }

      ctx.strokeStyle = "#4ade80";
      ctx.lineWidth = 2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = "#4ade80";
      ctx.beginPath();
      data.forEach((y, i) => {
        if (i === 0) ctx.moveTo(i * speed, y);
        else ctx.lineTo(i * speed, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      animationFrameId = requestAnimationFrame(draw);
    };

    if (isRunning) {
      draw();
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, [isRunning]);

  return <canvas ref={canvasRef} className="w-full h-48 rounded bg-black" />;
});

export default ECGCanvas;

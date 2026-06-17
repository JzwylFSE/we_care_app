import React, { useRef, useEffect } from 'react';

export default function ECGCanvas({ pulse = 72, mode = 'normal' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
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
    window.addEventListener('resize', resize);

    let running = true;
    const baseline = () => h / 2;
    const getBeatDuration = () => 60000 / Math.max(pulse, 40);

    const getECGValue = () => {
      const now = Date.now();
      const beatDuration = getBeatDuration();
      
      const timingMod = mode === 'afib' ? (Math.random() - 0.5) * 0.3 : 0;
      const cycle = ((now % beatDuration) / beatDuration + timingMod + 1) % 1;
      
      const b = baseline();
      const qrsWidth = mode === 'vtach' ? 0.12 : 0.08;
      
      if (mode !== 'afib' && cycle > 0.10 && cycle < 0.18) {
        return b - 25 * Math.sin((cycle - 0.10) / 0.08 * Math.PI);
      }
      
      if (cycle >= 0.18 && cycle < 0.22) return b;
      
      const qStart = 0.22;
      const rPeak = qStart + qrsWidth * 0.4;
      const sEnd = qStart + qrsWidth;
      
      if (cycle >= qStart && cycle < rPeak) return b + 15;
      if (cycle >= rPeak && cycle < sEnd) return b - (mode === 'vtach' ? 60 : 80);
      if (cycle >= sEnd && cycle < sEnd + 0.04) return b + (mode === 'vtach' ? 40 : 30);
      if (cycle >= sEnd + 0.04 && cycle < sEnd + 0.10) return b;
      
      if (cycle >= sEnd + 0.10 && cycle < sEnd + 0.30) {
        return b - 20 * Math.sin((cycle - sEnd - 0.10) / 0.20 * Math.PI);
      }
      
      return b + (Math.random() - 0.5) * (mode === 'afib' ? 8 : 2);
    };

    const draw = () => {
      if (!running) return;
      data.shift();
      data.push(getECGValue());

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
      for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 4;
      ctx.shadowColor = '#4ade80';
      ctx.beginPath();
      data.forEach((y, i) => {
        if (i === 0) ctx.moveTo(i * speed, y);
        else ctx.lineTo(i * speed, y);
      });
      ctx.stroke();
      ctx.shadowBlur = 0;

      requestAnimationFrame(draw);
    };

    const anim = requestAnimationFrame(draw);
    return () => {
      running = false;
      cancelAnimationFrame(anim);
      window.removeEventListener('resize', resize);
    };
  }, [pulse, mode]);

  return <canvas ref={canvasRef} className="w-full h-48 rounded bg-black" />;
}
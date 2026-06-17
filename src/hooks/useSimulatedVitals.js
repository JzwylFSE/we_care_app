import { useState, useEffect, useRef, useCallback } from 'react';

export function useSimulatedVitals(initialMode = 'normal') {
  const [mode, setMode] = useState(initialMode);
  
  const modeConfigs = {
    normal: {
      base: { pulse: 72, sys: 118, dia: 78, temp: 36.6, spo2: 98, resp: 16 },
      pulseVar: 3,
      rhythm: 'regular',
      irregularity: 0.02
    },
    bradycardia: {
      base: { pulse: 45, sys: 95, dia: 60, temp: 36.4, spo2: 97, resp: 12 },
      pulseVar: 2,
      rhythm: 'regular',
      irregularity: 0.03
    },
    tachycardia: {
      base: { pulse: 135, sys: 145, dia: 90, temp: 37.2, spo2: 95, resp: 24 },
      pulseVar: 5,
      rhythm: 'regular',
      irregularity: 0.04
    },
    afib: {
      base: { pulse: 80, sys: 125, dia: 82, temp: 36.8, spo2: 96, resp: 18 },
      pulseVar: 15,
      rhythm: 'irregular',
      irregularity: 0.25
    },
    vtach: {
      base: { pulse: 180, sys: 80, dia: 50, temp: 37.0, spo2: 85, resp: 28 },
      pulseVar: 8,
      rhythm: 'regular',
      irregularity: 0.06
    }
  };

  const [vitals, setVitals] = useState(modeConfigs[initialMode].base);
  const breathPhase = useRef(0);

  useEffect(() => {
    const config = modeConfigs[mode];
    let timeRef = 0;
    
    const interval = setInterval(() => {
      timeRef += 0.1;
      breathPhase.current = (breathPhase.current + 0.3) % (2 * Math.PI);
      
      const breath = Math.sin(breathPhase.current);
      const { base, pulseVar, rhythm, irregularity } = config;
      
      const rhythmMod = rhythm === 'irregular' 
        ? (Math.random() - 0.5) * pulseVar * 2 
        : breath * pulseVar * 0.5;
      
      let spo2 = base.spo2 + Math.sin(timeRef * 0.3) * 1;
      if (mode === 'vtach' && Math.sin(timeRef * 0.2) > 0.85) {
        spo2 -= 12;
      }
      
      setVitals({
        pulse: clamp(round(base.pulse + rhythmMod + Math.sin(timeRef * 0.7) * 2), 30, 200),
        sys: clamp(round(base.sys + (base.pulse - 72) * 0.6 + Math.sin(timeRef * 0.5) * 3), 70, 200),
        dia: clamp(round(base.dia + (base.pulse - 72) * 0.3 + Math.sin(timeRef * 0.5) * 2), 40, 120),
        temp: clamp(round(base.temp + Math.sin(timeRef * 0.02) * 0.2, 1), 35, 40),
        spo2: clamp(round(spo2), 70, 100),
        resp: clamp(round(base.resp + breath * 2), 8, 40),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [mode]);

  const changeMode = useCallback((newMode) => {
    setMode(newMode);
    setVitals(modeConfigs[newMode].base);
  }, []);

  return { vitals, mode, changeMode };
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function round(n, decimals = 0) {
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}
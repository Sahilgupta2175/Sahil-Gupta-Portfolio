import { useEffect, useState } from 'react';
import { profile } from '../data/profile';

// Re-renders every `ms` with the current Date.
export const useNow = (ms = 1000) => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), ms);
    return () => clearInterval(id);
  }, [ms]);
  return now;
};

// Hours/minutes/seconds in the profile's home time zone.
export const homeTime = (date) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: profile.timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).formatToParts(date);
  const get = (type) => parts.find((p) => p.type === type)?.value || '00';
  const hour = Number(get('hour')) % 24;
  return { hm: `${String(hour).padStart(2, '0')}:${get('minute')}`, s: get('second'), hour };
};

// Eased 0 -> target count once `start` turns true. Returns a number.
export const useCountUp = (target, start, duration = 1400) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start || !Number.isFinite(target)) return undefined;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setValue(target);
      return undefined;
    }
    let raf;
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value;
};

// "150+" -> { value: 150, suffix: '+' }; non-numeric strings keep value NaN.
export const splitNumber = (str) => {
  const m = String(str || '').match(/^([\d.]+)(.*)$/);
  return m ? { value: parseFloat(m[1]), suffix: m[2] } : { value: NaN, suffix: String(str || '') };
};

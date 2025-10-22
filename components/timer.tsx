'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';

export function Timer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="text-3xl font-mono">{minutes}:{secs}</div>
      <div className="flex items-center gap-2">
        <Button onClick={() => setRunning((value) => !value)}>{running ? 'Detener' : 'Iniciar'}</Button>
        <Button variant="outline" onClick={() => setSeconds(0)}>
          Reset
        </Button>
      </div>
    </div>
  );
}

'use client';

import { cn } from '../../lib/utils';

const hours = Array.from({ length: 24 }, (_, index) => index);
const days = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

export function Heatmap({ values }: { values: Record<string, number> }) {
  return (
    <div className="grid grid-cols-[80px_repeat(24,minmax(0,1fr))] gap-1 overflow-auto">
      <div className="sticky left-0 bg-white px-2 py-1 text-xs font-medium text-slate-500">&nbsp;</div>
      {hours.map((hour) => (
        <div key={hour} className="px-2 py-1 text-xs text-slate-500">
          {hour}
        </div>
      ))}
      {days.map((day) => (
        <div key={day} className="contents">
          <div className="sticky left-0 bg-white px-2 py-1 text-xs font-medium text-slate-500">{day}</div>
          {hours.map((hour) => {
            const key = `${day}-${hour}`;
            const intensity = Math.min(1, (values[key] ?? 0) / 180);
            return (
              <div
                key={key}
                className={cn('h-6 w-full rounded-sm', intensity === 0 ? 'bg-slate-100' : 'bg-emerald-400')}
                style={{ opacity: Math.max(0.15, intensity) }}
                aria-label={`${day} ${hour}hs`}
              >
                &nbsp;
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

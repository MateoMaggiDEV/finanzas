import { sumBy } from './utils';

export interface TimeEntryLike {
  id: string;
  start: string;
  end: string;
  durationMin: number;
  deepWork: boolean;
  billable: boolean;
  clientId?: string;
  projectId?: string;
  source: 'MANUAL' | 'TIMER' | 'CALENDAR';
}

export interface InterruptionLike {
  id: string;
  at: string;
  minutes: number;
}

export interface ProductivityMetrics {
  totalMinutes: number;
  deepWorkMinutes: number;
  interruptions: number;
  billableMinutes: number;
  contextSwitches: number;
}

export function computeProductivity(entries: TimeEntryLike[], interruptions: InterruptionLike[]): ProductivityMetrics {
  const sorted = [...entries].sort((a, b) => a.start.localeCompare(b.start));
  const contextSwitches = sorted.reduce((count, current, index) => {
    if (index === 0) return 0;
    const prev = sorted[index - 1];
    if (prev.projectId !== current.projectId) return count + 1;
    return count;
  }, 0);

  const totalMinutes = sumBy(entries, (entry) => entry.durationMin);
  const deepWorkMinutes = sumBy(entries, (entry) => (entry.deepWork ? entry.durationMin : 0));
  const billableMinutes = sumBy(entries, (entry) => (entry.billable ? entry.durationMin : 0));
  const interruptionsTotal = sumBy(interruptions, (i) => i.minutes);

  return {
    totalMinutes,
    deepWorkMinutes,
    interruptions: interruptionsTotal,
    billableMinutes,
    contextSwitches
  };
}

export function focusRatio(metrics: ProductivityMetrics) {
  if (metrics.totalMinutes === 0) return 0;
  return metrics.deepWorkMinutes / metrics.totalMinutes;
}

export function focusScore(metrics: ProductivityMetrics) {
  if (metrics.totalMinutes === 0) return 0;
  const focus = focusRatio(metrics);
  const interruptionPenalty = Math.min(1, metrics.interruptions / 60);
  const deepWorkBonus = metrics.deepWorkMinutes >= 150 ? 0.1 : 0;
  return Math.max(0, Math.min(1, focus - interruptionPenalty * 0.3 + deepWorkBonus));
}

export function effectiveHourlyRate(incomeMinor: number, metrics: ProductivityMetrics) {
  const hours = metrics.totalMinutes / 60;
  if (hours === 0) return 0;
  return incomeMinor / hours;
}

export function detectFocusRecommendations(metrics: ProductivityMetrics) {
  const recommendations: string[] = [];
  const focus = focusRatio(metrics);
  if (focus < 0.4) {
    recommendations.push('Aumentá tus bloques de deep work para superar el 40% de foco.');
  }
  if (metrics.contextSwitches > 5) {
    recommendations.push('Agrupá tareas similares para reducir cambios de contexto.');
  }
  if (metrics.interruptions > 45) {
    recommendations.push('Configura recordatorios de modo “No molestar” durante tus bloques críticos.');
  }
  if (recommendations.length === 0) {
    recommendations.push('Excelente foco esta semana. Sostené la rutina actual.');
  }
  return recommendations;
}

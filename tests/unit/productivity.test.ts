import { describe, expect, it } from 'vitest';
import {
  computeProductivity,
  detectFocusRecommendations,
  effectiveHourlyRate,
  focusRatio
} from '../../lib/productivity';

const entries = [
  {
    id: '1',
    start: '2024-05-01T09:00:00.000Z',
    end: '2024-05-01T10:30:00.000Z',
    durationMin: 90,
    deepWork: true,
    billable: true,
    clientId: 'client',
    projectId: 'project',
    source: 'TIMER' as const
  },
  {
    id: '2',
    start: '2024-05-01T11:00:00.000Z',
    end: '2024-05-01T12:00:00.000Z',
    durationMin: 60,
    deepWork: false,
    billable: false,
    clientId: 'client',
    projectId: 'project-2',
    source: 'MANUAL' as const
  }
];

const interruptions = [{ id: 'i1', at: '2024-05-01T11:30:00.000Z', minutes: 10 }];

describe('productivity metrics', () => {
  const metrics = computeProductivity(entries, interruptions);

  it('computes totals correctly', () => {
    expect(metrics.totalMinutes).toBe(150);
    expect(metrics.deepWorkMinutes).toBe(90);
  });

  it('calculates focus ratio', () => {
    expect(focusRatio(metrics)).toBeCloseTo(0.6, 1);
  });

  it('suggests recommendations when focus is low', () => {
    const recommendations = detectFocusRecommendations(metrics);
    expect(recommendations.length).toBeGreaterThan(0);
  });

  it('computes effective hourly rate', () => {
    const rate = effectiveHourlyRate(300_000, metrics);
    expect(rate).toBeGreaterThan(0);
  });
});

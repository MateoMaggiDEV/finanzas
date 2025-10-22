import { focusRatio, type ProductivityMetrics } from './productivity';

export interface InsightContext {
  cashflowNetMinor: number;
  burnRateMinor: number;
  runwayMonths: number;
  focusMetrics: ProductivityMetrics;
}

export function buildInsights(context: InsightContext) {
  const insights: string[] = [];

  if (context.cashflowNetMinor < 0) {
    insights.push('Revisa tus egresos del mes: el cashflow es negativo.');
  } else {
    insights.push('Cashflow positivo: reinvertí en adquisición de clientes.');
  }

  if (context.runwayMonths < 3) {
    insights.push('Runway menor a 3 meses. Reducí gastos fijos o acelerá cobros.');
  }

  const focus = focusRatio(context.focusMetrics);
  if (focus < 0.4) {
    insights.push('Duplicá tus bloques de deep work entre 09:00-13:00.');
  }
  if (context.focusMetrics.contextSwitches > 5) {
    insights.push('Disminuí los cambios de contexto agrupando proyectos similares.');
  }

  if (context.focusMetrics.billableMinutes < context.focusMetrics.totalMinutes * 0.5) {
    insights.push('Aumentá el % de horas facturables asignando tareas clave a clientes premium.');
  }

  return insights;
}

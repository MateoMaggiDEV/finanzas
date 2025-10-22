'use client';

import { Area, AreaChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../../lib/utils';

export interface CashflowPoint {
  month: string;
  incomeMinor: number;
  expenseMinor: number;
  netMinor: number;
}

export function CashflowChart({ data }: { data: CashflowPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ left: 20, right: 20, top: 20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis tickFormatter={(value) => formatCurrency(value, 'ARS')} width={120} />
        <Tooltip formatter={(value: number) => formatCurrency(value, 'ARS')} />
        <Legend />
        <Area type="monotone" dataKey="incomeMinor" stackId="1" stroke="#0f766e" fill="#14b8a6" name="Ingresos" />
        <Area type="monotone" dataKey="expenseMinor" stackId="1" stroke="#dc2626" fill="#f87171" name="Egresos" />
        <Area type="monotone" dataKey="netMinor" stroke="#334155" fill="rgba(30,41,59,0.3)" name="Neto" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

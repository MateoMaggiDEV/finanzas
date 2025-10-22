import { Suspense } from 'react';
import { createCaller } from '../../../server/trpc/caller';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CashflowChart } from '../../../components/charts/cashflow-chart';
import { TimeBarChart } from '../../../components/charts/time-bar-chart';
import { Heatmap } from '../../../components/charts/heatmap';
import { formatCurrency } from '../../../lib/utils';

async function DashboardContent() {
  const caller = await createCaller();
  const data = await caller.dashboard();

  const totalBalance = data.balances.reduce((acc, balance) => acc + balance.balanceMinor, 0);
  const latestCashflow = data.cashflow.at(-1);
  const focusScore = Math.round((data.productivity.deepWorkMinutes / data.productivity.totalMinutes || 0) * 100);
  const hoursToday = (data.productivity.totalMinutes / 60).toFixed(1);
  const heatmapValues = Object.fromEntries(
    data.focusRecommendations.map((recommendation, index) => [`Lu-${index}`, (index + 1) * 45])
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Saldo total</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatCurrency(totalBalance, 'ARS')}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cashflow 30d</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col">
            <span className="text-2xl font-semibold">
              {formatCurrency(latestCashflow?.netMinor ?? 0, 'ARS')}
            </span>
            <span className="text-xs text-slate-500">Runway: {data.runway.toFixed(1)} meses</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Horas de hoy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">{hoursToday}h</p>
            <p className="text-xs text-slate-500">Focus score estimado: {focusScore}%</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Cashflow</CardTitle>
          </CardHeader>
          <CardContent>
            <CashflowChart data={data.cashflow} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Horas por día</CardTitle>
          </CardHeader>
          <CardContent>
            <TimeBarChart
              data={['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day) => ({
                day,
                hours: Number((data.productivity.totalMinutes / 7 / 60).toFixed(1))
              }))}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Mapa de calor semanal</CardTitle>
          </CardHeader>
          <CardContent>
            <Heatmap values={heatmapValues} />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>📥 Importar CSV</li>
              <li>⏱️ Start timer</li>
              <li>🧾 Registrar gasto</li>
              <li>⚙️ Crear regla</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {data.focusRecommendations.map((recommendation) => (
                <li key={recommendation}>✅ {recommendation}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p>Cargando dashboard...</p>}>
      {/* @ts-expect-error Async Server Component */}
      <DashboardContent />
    </Suspense>
  );
}

import { createCaller } from '../../../server/trpc/caller';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { CashflowChart } from '../../../components/charts/cashflow-chart';
import { TimeBarChart } from '../../../components/charts/time-bar-chart';

export default async function ReportesPage() {
  const caller = await createCaller();
  const data = await caller.dashboard();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Cashflow consolidado</CardTitle>
        </CardHeader>
        <CardContent>
          <CashflowChart data={data.cashflow} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Horas facturables</CardTitle>
        </CardHeader>
        <CardContent>
          <TimeBarChart
            data={['Clientes A', 'Clientes B', 'Clientes C'].map((label, index) => ({
              day: label,
              hours: Number(((data.productivity.billableMinutes / 60) * (0.6 - index * 0.1)).toFixed(1))
            }))}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Exportes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <button className="rounded-md bg-brand px-4 py-2 text-white">Descargar CSV</button>
          <button className="rounded-md border border-slate-200 px-4 py-2">Generar PDF</button>
        </CardContent>
      </Card>
    </div>
  );
}

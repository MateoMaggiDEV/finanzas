import { createCaller } from '../../../server/trpc/caller';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, THead, TH, TR, TD } from '../../../components/ui/table';
import { formatCurrency } from '../../../lib/utils';

export default async function FinanzasPage() {
  const caller = await createCaller();
  const data = await caller.dashboard();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Transacciones recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Fecha</TH>
                <TH>Descripción</TH>
                <TH>Monto</TH>
                <TH>Cuenta</TH>
              </TR>
            </THead>
            <tbody>
              {data.cashflow.slice(-5).map((row) => (
                <TR key={row.month}>
                  <TD>{row.month}</TD>
                  <TD>Resumen mensual</TD>
                  <TD>{formatCurrency(row.netMinor, 'ARS')}</TD>
                  <TD>Consolidado</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Configurar Presupuestos</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col text-sm">
              Categoría
              <input className="mt-1 rounded-md border border-slate-200 px-3 py-2" placeholder="Software" />
            </label>
            <label className="flex flex-col text-sm">
              Límite mensual
              <input className="mt-1 rounded-md border border-slate-200 px-3 py-2" placeholder="$400.000" />
            </label>
            <button type="button" className="mt-auto rounded-md bg-brand px-4 py-2 text-white">
              Guardar
            </button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

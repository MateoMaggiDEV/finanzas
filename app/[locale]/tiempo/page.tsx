import { Timer } from '../../../components/timer';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, THead, TH, TR, TD } from '../../../components/ui/table';
import { createCaller } from '../../../server/trpc/caller';

export default async function TiempoPage() {
  const caller = await createCaller();
  const data = await caller.dashboard();

  return (
    <div className="space-y-6">
      <Timer />
      <Card>
        <CardHeader>
          <CardTitle>Entradas de tiempo recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Proyecto</TH>
                <TH>Duración</TH>
                <TH>Deep Work</TH>
              </TR>
            </THead>
            <tbody>
              {data.productivity.contextSwitches > -1 && [1, 2, 3].map((item) => (
                <TR key={item}>
                  <TD>Edición Cliente {item}</TD>
                  <TD>1h 30m</TD>
                  <TD>{item % 2 === 0 ? 'Sí' : 'No'}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bloques de Deep Work</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>📅 Lunes 09:00 - 11:00</li>
            <li>📅 Miércoles 10:00 - 12:00</li>
            <li>📅 Viernes 16:00 - 18:00</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

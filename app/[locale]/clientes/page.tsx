import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, THead, TH, TR, TD } from '../../../components/ui/table';
import { prisma } from '../../../server/prisma';
import { formatCurrency } from '../../../lib/utils';

export default async function ClientesPage() {
  const user = await prisma.user.findFirst();
  const clients = user
    ? await prisma.client.findMany({ where: { userId: user.id, deletedAt: null }, include: { projects: true } })
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Nombre</TH>
                <TH>Tarifa por hora</TH>
                <TH>Proyectos activos</TH>
              </TR>
            </THead>
            <tbody>
              {clients.map((client) => (
                <TR key={client.id}>
                  <TD>{client.name}</TD>
                  <TD>
                    {client.defaultRatePerHourMinor
                      ? formatCurrency(client.defaultRatePerHourMinor, 'ARS')
                      : '—'}
                  </TD>
                  <TD>{client.projects.length}</TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

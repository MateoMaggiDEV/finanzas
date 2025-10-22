import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, THead, TH, TR, TD } from '../../../components/ui/table';
import { prisma } from '../../../server/prisma';
import { formatCurrency } from '../../../lib/utils';

export default async function ProyectosPage() {
  const user = await prisma.user.findFirst();
  const projects = user
    ? await prisma.project.findMany({ where: { userId: user.id, deletedAt: null }, include: { client: true } })
    : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <THead>
              <TR>
                <TH>Proyecto</TH>
                <TH>Cliente</TH>
                <TH>Estado</TH>
                <TH>Tarifa</TH>
              </TR>
            </THead>
            <tbody>
              {projects.map((project) => (
                <TR key={project.id}>
                  <TD>{project.name}</TD>
                  <TD>{project.client?.name ?? '—'}</TD>
                  <TD>{project.status}</TD>
                  <TD>
                    {project.ratePerHourMinor
                      ? formatCurrency(project.ratePerHourMinor, 'ARS')
                      : '—'}
                  </TD>
                </TR>
              ))}
            </tbody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { prisma } from '../../../server/prisma';

export default async function AutomatizacionesPage() {
  const user = await prisma.user.findFirst();
  const rules = user ? await prisma.rule.findMany({ where: { userId: user.id, deletedAt: null } }) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reglas de categorización</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {rules.map((rule) => (
              <li key={rule.id}>
                <strong>{rule.mode.toUpperCase()}:</strong> {rule.expression}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Alertas activas</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li>⚠️ Presupuesto software al 85%</li>
            <li>🔔 Foco semanal bajo 40%</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

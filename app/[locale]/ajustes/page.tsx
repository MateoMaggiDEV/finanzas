import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';

export default function AjustesPage() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Preferencias generales</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col text-sm">
            Moneda base
            <select className="mt-1 rounded-md border border-slate-200 px-3 py-2">
              <option>ARS</option>
              <option>USD</option>
              <option>EUR</option>
            </select>
          </label>
          <label className="flex flex-col text-sm">
            Días laborables
            <input className="mt-1 rounded-md border border-slate-200 px-3 py-2" defaultValue="Lun-Sáb" />
          </label>
          <label className="flex flex-col text-sm md:col-span-2">
            Bloques sugeridos
            <input className="mt-1 rounded-md border border-slate-200 px-3 py-2" defaultValue="09:00-13:00 / 16:00-18:00" />
          </label>
        </CardContent>
      </Card>
    </div>
  );
}

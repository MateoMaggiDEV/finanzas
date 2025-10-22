# NombreDeLaApp

Plataforma integral de finanzas y productividad para agencias de edición de video. Construido con Next.js 14, Prisma y tRPC.

## ⚙️ Requisitos

- Node.js >= 18
- pnpm >= 8
- PostgreSQL (local o remoto)

## 🚀 Puesta en marcha local

```bash
pnpm install
cp .env.example .env
# Actualizar variables y credenciales
pnpm db:push
pnpm db:seed
pnpm dev
```

La aplicación corre en `http://localhost:3000`.

### Scripts disponibles

- `pnpm dev`: Desarrollo con recarga.
- `pnpm build` / `pnpm start`: Build y producción.
- `pnpm lint`: ESLint.
- `pnpm test`: Tests unitarios (Vitest).
- `pnpm test:e2e`: Tests E2E (Playwright).
- `pnpm db:push`: Sincroniza esquema con base.
- `pnpm db:seed`: Inserta datos demo.

## 🏗️ Decisiones clave

- **tRPC** elegido para garantizar typings end-to-end en las APIs `/api/trpc`.
- Seeds realistas basados en clientes ficticios: Reels Mentorship, Luxury Coach, Faith Academy, Creators Lab.
- Integraciones externas (Google OAuth, Calendar) expuestas vía configuraciones en `.env` y stubs cuando faltan credenciales.
- Conversión de moneda simple con tabla editable y tasas ejemplo (ARS base, USD/EUR).

## 🗂️ Estructura

```
/app
  /(dashboard)
  /finanzas
  /tiempo
  /clientes
  /proyectos
  /reportes
  /automatizaciones
  /ajustes
  /api (tRPC + cron)
/components
/lib
/data
/tests
/prisma
```

## 🌎 Internacionalización

Configurada con `next-intl`. Locale por defecto `es-AR`, fallback `en-US`. Las monedas soportadas son ARS, USD y EUR.

## 🛡️ Seguridad y privacidad

- Separación por usuario mediante `userId` en todas las tablas y helpers de acceso.
- Validación Zod en formularios y routers tRPC.
- Uploads limitados a PDF/JPG/PNG <= 5MB (pendiente de integrar almacenamiento externo en producción).

## 🧪 Testing

- Unit tests: cálculos de métricas financieras y de productividad.
- E2E smoke (Playwright) cubriendo onboarding, importación MP y timer.

Para ejecutar Playwright en CI, instalar browsers con `pnpm exec playwright install --with-deps`.

## ☁️ Deploy

### Vercel

1. Crear proyecto Vercel y asociar repo.
2. Configurar variables de entorno (`.env.example`).
3. Usar Neon o supabase como Postgres.
4. Habilitar cron (GitHub Actions o Vercel Cron) apuntando a `/api/cron/daily` y `/api/cron/weekly`.

### Docker

Incluimos `docker-compose.yml` para stack local.

```bash
docker compose up -d
pnpm db:push
pnpm db:seed
```

## 📄 CSV de ejemplo

- `data/csv/mercado-pago-sample.csv`
- `data/csv/uala-sample.csv`

## ⌨️ Atajos

- `T`: start/stop timer.
- `I`: registrar interrupción.
- `N`: nueva transacción.
- `/`: búsqueda global.

## 🔔 Recordatorios

- Bloques de Deep Work disparan recordatorios de navegador (`Notification API`).
- Modo “No molestar” oculta notificaciones in-app mientras está activo.

## 📚 Más información

Consulta `docs/` (futuro) para guías de integración adicionales.

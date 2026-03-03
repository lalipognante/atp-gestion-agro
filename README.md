# ATP Gestión Agro

Sistema interno de gestión agropecuaria (NestJS + Prisma + Next.js 14).

---

## Requisitos

- Node.js 20+
- Docker (para Postgres local)
- npm

---

## Local vs Producción

### Local

```bash
# 1. Levantar Postgres
docker-compose up -d

# 2. Configurar .env del backend
cp backend/.env.example backend/.env
# Editar DATABASE_URL si es necesario (por defecto usa localhost:5432)

# 3. Aplicar migraciones
cd backend
npm run db:migrate

# 4. (Opcional) Cargar datos de prueba — solo manual, nunca automático
npm run db:seed

# 5. Levantar backend
npm run start:dev

# 6. Levantar frontend (en otra terminal)
cd ../frontend
npm run dev
```

El frontend corre en http://localhost:3001 y el backend en http://localhost:3000.

### Producción (Neon)

1. Crear proyecto en [Neon](https://neon.tech) y copiar la connection string.
2. En el servicio de backend (Railway, Render, Fly.io, etc.) configurar la variable de entorno:
   ```
   DATABASE_URL=postgresql://user:password@ep-xxx.neon.tech/atp_agro?sslmode=require
   ```
3. En el deploy hook del backend, ejecutar:
   ```bash
   npm run db:migrate
   ```
   **No ejecutar `db:seed` en producción.**

### Vercel (Frontend)

```bash
cd frontend
vercel deploy --prod
```

Variables de entorno en Vercel:
```
BACKEND_URL=https://tu-backend.railway.app
```

---

## Scripts disponibles (backend)

| Script | Descripción |
|--------|-------------|
| `npm run start:dev` | Servidor en modo watch |
| `npm run build` | Compilar para producción |
| `npm run start:prod` | Iniciar build de producción |
| `npm run db:migrate` | Aplicar migraciones (`prisma migrate deploy`) |
| `npm run db:seed` | Cargar datos de prueba (manual) |
| `npm run db:studio` | Abrir Prisma Studio |

---

## Usuarios de prueba (seed)

| Email | Password | Rol |
|-------|----------|-----|
| admin@atp.com | admin123 | ADMIN |
| viewer@atp.com | viewer123 | VIEWER |

---

## Estructura

```
backend/     NestJS + Prisma
frontend/    Next.js 14 App Router + Tailwind
```

---

## Endpoints principales

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | /auth/login | Login |
| GET | /dashboard | Resumen general |
| GET/POST | /fields | Campos |
| GET/POST/PATCH | /lots | Lotes |
| GET/POST | /stock | Movimientos de stock |
| GET/POST | /financial | Movimientos financieros |
| GET/POST | /hacienda/movements | Movimientos de hacienda |
| GET/POST | /hacienda/health | Registros sanitarios |
| GET/POST/PATCH | /obligations | Obligaciones |

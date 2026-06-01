export const dynamic = "force-dynamic";

import { getDashboardData } from "@/services/dashboard";
import { Header } from "@/components/layout/Header";
import { ActivityList } from "@/components/ui/ActivityList";
import { CompactEmpty } from "@/components/ui/ProductPage";
import { formatCurrency, formatDateShort, formatNumber } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  TERNEROS: "Terneros",
  NOVILLOS: "Novillos",
  VACAS: "Vacas",
  TOROS: "Toros",
};

function PageError({ message }: { message: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-10">
      <div className="max-w-sm text-center">
        <p className="text-sm font-bold text-neutral-900">No se pudo cargar Inicio</p>
        <p className="mt-1 text-xs text-neutral-400">{message}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  let data;
  try {
    data = await getDashboardData();
  } catch (err) {
    return <PageError message={err instanceof Error ? err.message : "Error de conexión con el servidor"} />;
  }

  const { stock, livestock, financial, obligations, lastMovements, recentThirdPartyWorks } = data;
  const commitments = [...obligations.urgent, ...obligations.upcoming].slice(0, 4);
  const activeThirdPartyWorks = (recentThirdPartyWorks ?? []).filter((work) => work.status === "PENDING" && !work.deletedAt);
  const resultPositive = financial.monthlyResult >= 0;
  const maxFinancialValue = Math.max(financial.monthlyIncome, financial.monthlyExpense, Math.abs(financial.monthlyResult), 1);
  const bars = [
    { label: "Ingresos", value: financial.monthlyIncome, color: "bg-accent" },
    { label: "Egresos", value: financial.monthlyExpense, color: "bg-white/35" },
    { label: "Resultado", value: Math.abs(financial.monthlyResult), color: resultPositive ? "bg-green-500" : "bg-[#D16B6B]" },
  ];
  const attention = [
    ...obligations.urgent.slice(0, 2).map((item) => ({
      id: item.id,
      eyebrow: "Vencimiento prioritario",
      title: item.concept,
      detail: `${formatCurrency(Number(item.amount), item.currency)} · vence ${formatDateShort(item.dueDate)}`,
    })),
    ...activeThirdPartyWorks.slice(0, 1).map((work) => ({
      id: work.id,
      eyebrow: "Labor externa pendiente",
      title: work.contractor,
      detail: `${work.lot?.field?.name ?? "Campo"} · ${work.amount ? formatCurrency(Number(work.amount), work.currency ?? "ARS") : `${work.quintales ?? 0} qq`}`,
    })),
    ...(stock.totalNetStock < 0
      ? [{
          id: "stock-negative",
          eyebrow: "Control de stock",
          title: "El stock neto requiere revisión",
          detail: `${formatNumber(stock.totalNetStock)} unidades registradas`,
        }]
      : []),
  ].slice(0, 3);
  const today = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());

  return (
    <>
      <Header title="Inicio" />
      <div className="flex-1 overflow-auto">
        <main className="mx-auto max-w-[1440px] p-4 sm:p-6 lg:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.15em] text-green-700">{today}</p>
              <h1 className="mt-2 text-[1.8rem] font-extrabold tracking-[-0.075em] text-neutral-900 sm:text-[2.15rem]">Buen día, Agustín</h1>
              <p className="mt-1 text-[0.82rem] text-neutral-400">El pulso operativo de La Primavera, resumido para decidir.</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
            <section className="rounded-card border app-border app-surface p-5 app-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-[0.95rem] font-extrabold tracking-[-0.03em] text-neutral-900">Atención requerida</h2>
                  <p className="mt-1 text-[0.72rem] text-neutral-400">
                    {attention.length > 0 ? `${attention.length} temas priorizados por impacto operativo` : "No hay alertas críticas registradas"}
                  </p>
                </div>
                <span className="rounded-full bg-[#FEF0F0] px-2.5 py-1 text-[0.65rem] font-extrabold text-[#C0505A]">
                  {obligations.urgent.length} urgentes
                </span>
              </div>
              <div className="mt-4 grid gap-2">
                {attention.length > 0 ? attention.map((item) => (
                  <article key={item.id} className="group flex items-center justify-between gap-3 rounded-[12px] border app-border app-surface-soft px-4 py-3">
                    <div>
                      <p className="text-[0.61rem] font-extrabold uppercase tracking-[0.11em] text-green-700">{item.eyebrow}</p>
                      <h3 className="mt-1 text-[0.8rem] font-extrabold text-neutral-900">{item.title}</h3>
                      <p className="mt-1 text-[0.7rem] text-neutral-400">{item.detail}</p>
                    </div>
                    <span className="text-lg text-neutral-400 transition group-hover:translate-x-1 group-hover:text-green-700">→</span>
                  </article>
                )) : <CompactEmpty>Operación sin alertas críticas para hoy.</CompactEmpty>}
              </div>
            </section>

            <section className="rounded-card border border-white/10 bg-green-950 p-5 text-white shadow-[0_18px_48px_rgba(16,36,26,0.22)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.15em] text-white/45">Caja del mes</p>
                  <p className="mt-5 text-[1.8rem] font-extrabold tracking-[-0.08em] tabular-nums">{formatCurrency(financial.monthlyResult)}</p>
                  <p className="mt-1 text-[0.7rem] text-white/45">Resultado registrado del período actual</p>
                </div>
                <span className="rounded-full bg-accent px-2.5 py-1 text-[0.62rem] font-extrabold text-green-950">{resultPositive ? "POSITIVO" : "REVISAR"}</span>
              </div>
              <div className="mt-8 flex h-24 items-end justify-around gap-4">
                {bars.map((bar) => (
                  <div key={bar.label} className="flex h-full flex-1 flex-col justify-end gap-2">
                    <div className={`mx-auto w-full max-w-[58px] rounded-t ${bar.color}`} style={{ height: `${Math.max(12, (bar.value / maxFinancialValue) * 100)}%` }} />
                    <span className="text-center text-[0.58rem] font-bold uppercase tracking-[0.08em] text-white/40">{bar.label}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[12px] border app-border app-surface px-4 py-3">
              <p className="text-[0.63rem] font-bold uppercase tracking-[0.11em] text-neutral-400">Agricultura</p>
              <p className="mt-2 text-[1rem] font-extrabold text-neutral-900 tabular-nums">{formatNumber(stock.totalNetStock)} u</p>
              <p className="mt-1 text-[0.68rem] text-neutral-400">Stock disponible registrado</p>
            </div>
            <div className="rounded-[12px] border app-border app-surface px-4 py-3">
              <p className="text-[0.63rem] font-bold uppercase tracking-[0.11em] text-neutral-400">Ganadería</p>
              <p className="mt-2 text-[1rem] font-extrabold text-neutral-900 tabular-nums">{formatNumber(livestock.totalHeads)} cabezas</p>
              <p className="mt-1 text-[0.68rem] text-neutral-400">Rodeo actual</p>
            </div>
            <div className="rounded-[12px] border app-border app-surface px-4 py-3">
              <p className="text-[0.63rem] font-bold uppercase tracking-[0.11em] text-neutral-400">Compromisos</p>
              <p className="mt-2 text-[1rem] font-extrabold text-neutral-900 tabular-nums">{obligations.pendingCount ?? 0} pendientes</p>
              <p className="mt-1 text-[0.68rem] text-neutral-400">Obligaciones registradas</p>
            </div>
            <div className="rounded-[12px] border app-border app-surface px-4 py-3">
              <p className="text-[0.63rem] font-bold uppercase tracking-[0.11em] text-neutral-400">Rodeo por categoría</p>
              <p className="mt-2 text-[1rem] font-extrabold text-neutral-900 tabular-nums">{Object.keys(livestock.byCategory ?? {}).length} categorías</p>
              <p className="mt-1 truncate text-[0.68rem] text-neutral-400">{Object.entries(livestock.byCategory ?? {}).map(([key, value]) => `${CATEGORY_LABEL[key] ?? key}: ${value}`).join(" · ") || "Sin registros"}</p>
            </div>
          </section>

          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.75fr]">
            <section className="rounded-card border app-border app-surface p-5 app-shadow">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-[0.92rem] font-extrabold tracking-[-0.03em] text-neutral-900">Actividad reciente</h2>
                <span className="text-[0.68rem] font-bold text-green-700">Últimos movimientos</span>
              </div>
              <div className="mt-3"><ActivityList items={lastMovements.slice(0, 5)} /></div>
            </section>

            <section className="rounded-card border app-border app-surface p-5 app-shadow">
              <h2 className="text-[0.92rem] font-extrabold tracking-[-0.03em] text-neutral-900">Próximos compromisos</h2>
              <div className="mt-4 grid gap-3">
                {commitments.length > 0 ? commitments.map((item) => (
                  <article key={item.id} className="grid grid-cols-[54px_minmax(0,1fr)] gap-3 border-b app-border pb-3 last:border-0 last:pb-0">
                    <time className="text-[0.63rem] font-extrabold uppercase tracking-[0.08em] text-green-700" dateTime={item.dueDate}>{formatDateShort(item.dueDate)}</time>
                    <div>
                      <h3 className="text-[0.78rem] font-extrabold text-neutral-900">{item.concept}</h3>
                      <p className="mt-1 text-[0.68rem] text-neutral-400">{formatCurrency(Number(item.amount), item.currency)} · {item.type}</p>
                    </div>
                  </article>
                )) : <CompactEmpty>No hay obligaciones próximas registradas.</CompactEmpty>}
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

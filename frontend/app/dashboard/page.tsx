export const dynamic = "force-dynamic";

import { getDashboardData } from "@/services/dashboard";
import { Header } from "@/components/layout/Header";
import { ActivityList } from "@/components/ui/ActivityList";
import { CompactEmpty, PageIntro, SummaryMetric } from "@/components/ui/ProductPage";
import { SectionCard } from "@/components/ui/SectionCard";
import { formatCurrency, formatDateShort, formatNumber } from "@/lib/utils";

const CATEGORY_LABEL: Record<string, string> = {
  TERNEROS: "Terneros",
  NOVILLOS: "Novillos",
  VACAS: "Vacas",
  TOROS: "Toros",
};

const TREATMENT_LABEL: Record<string, string> = {
  VACUNA: "Vacunación",
  BAÑO: "Baño",
  DESPARASITACION: "Desparasitación",
  OTRO: "Otro",
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

  const { stock, livestock, financial, obligations, lastMovements, latestHealthRecords } = data;
  const commitments = [...obligations.urgent, ...obligations.upcoming];
  const resultPositive = financial.monthlyResult >= 0;
  const today = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const attention = [
    ...obligations.urgent.slice(0, 2).map((item) => ({
      id: item.id,
      label: "Vencimiento prioritario",
      title: item.concept,
      detail: `${formatCurrency(Number(item.amount), item.currency)} · vence ${formatDateShort(item.dueDate)}`,
    })),
    ...(stock.totalNetStock < 0
      ? [{
          id: "stock-negative",
          label: "Control de stock",
          title: "El stock neto requiere revisión",
          detail: `${formatNumber(stock.totalNetStock)} unidades registradas`,
        }]
      : []),
  ];

  return (
    <>
      <Header title="Inicio" subtitle="Pulso operativo del establecimiento" />
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 p-4 sm:p-6 lg:p-7">
          <PageIntro
            eyebrow={today}
            title="Buen día. Este es el pulso de La Primavera."
            description="Lo importante para decidir hoy: compromisos, caja del mes, producción y movimientos recientes."
          />

          <section className="rounded-card border border-green-800 bg-green-950 p-5 text-white app-shadow">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="lg:max-w-[300px]">
                <div className="text-[0.66rem] font-extrabold uppercase tracking-[0.15em] text-accent">Morning brief</div>
                <h3 className="mt-2 text-xl font-extrabold tracking-[-0.06em]">Atención requerida</h3>
                <p className="mt-1 text-[0.78rem] leading-5 text-white/60">
                  {attention.length > 0
                    ? `${attention.length} tema${attention.length !== 1 ? "s" : ""} para revisar antes de avanzar.`
                    : "No hay urgencias críticas registradas para hoy."}
                </p>
              </div>
              <div className="grid flex-1 gap-2 lg:max-w-[820px] lg:grid-cols-2">
                {attention.length > 0 ? attention.map((item) => (
                  <div key={item.id} className="rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-3">
                    <div className="text-[0.62rem] font-extrabold uppercase tracking-[0.12em] text-accent">{item.label}</div>
                    <div className="mt-1 text-[0.82rem] font-bold">{item.title}</div>
                    <div className="mt-1 text-[0.7rem] text-white/55">{item.detail}</div>
                  </div>
                )) : (
                  <div className="rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-3 lg:col-span-2">
                    <div className="text-[0.82rem] font-bold">Operación sin alertas críticas</div>
                    <div className="mt-1 text-[0.7rem] text-white/55">Podés concentrarte en los próximos compromisos y movimientos del establecimiento.</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <SummaryMetric label="Resultado del mes" value={formatCurrency(financial.monthlyResult)} detail={resultPositive ? "Balance positivo" : "Balance negativo"} tone={resultPositive ? "positive" : "danger"} />
            <SummaryMetric label="Compromisos" value={String(obligations.pendingCount ?? 0)} detail="Obligaciones pendientes" tone={(obligations.pendingCount ?? 0) > 0 ? "warning" : "positive"} />
            <SummaryMetric label="Hacienda" value={formatNumber(livestock.totalHeads)} detail="Cabezas en rodeo" />
            <SummaryMetric label="Stock disponible" value={`${formatNumber(stock.totalNetStock)} u`} detail="Stock neto registrado" tone={stock.totalNetStock < 0 ? "danger" : "default"} />
          </div>

          <div className="grid grid-cols-1 gap-3.5 xl:grid-cols-[minmax(0,1fr)_340px]">
            <SectionCard title="Próximos compromisos" actions={<span className="text-[0.7rem] text-neutral-400">{commitments.length} próximos</span>}>
              {commitments.length > 0 ? (
                <div className="divide-y app-border">
                  {commitments.map((item) => (
                    <div key={item.id} className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="text-[0.82rem] font-bold text-neutral-900">{item.concept}</div>
                        <div className="mt-1 text-[0.7rem] text-neutral-400">Vence {formatDateShort(item.dueDate)} · {item.type}</div>
                      </div>
                      <div className="text-[0.82rem] font-extrabold tabular-nums text-neutral-900">{formatCurrency(Number(item.amount), item.currency)}</div>
                    </div>
                  ))}
                </div>
              ) : <CompactEmpty>No hay obligaciones próximas registradas.</CompactEmpty>}
            </SectionCard>
            <SectionCard title="Actividad reciente">
              <ActivityList items={lastMovements.slice(0, 6)} />
            </SectionCard>
          </div>

          <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <SectionCard title="Estado productivo" actions={<span className="text-[0.7rem] text-neutral-400">{formatNumber(livestock.totalHeads)} cabezas</span>}>
              {Object.keys(livestock.byCategory ?? {}).length > 0 ? (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Object.entries(livestock.byCategory).map(([category, count]) => (
                    <div key={category} className="rounded-[12px] app-surface-soft px-3 py-4">
                      <div className="text-[1.55rem] font-extrabold tracking-[-0.06em] text-neutral-900 tabular-nums">{formatNumber(count)}</div>
                      <div className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-neutral-400">{CATEGORY_LABEL[category] ?? category}</div>
                    </div>
                  ))}
                </div>
              ) : <CompactEmpty>Sin registros de hacienda.</CompactEmpty>}
            </SectionCard>
            <SectionCard title="Economía del mes">
              <div className="grid gap-2">
                <div className="flex items-end justify-between gap-3 border-b app-border pb-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-neutral-400">Ingresos</span>
                  <span className="text-[1rem] font-extrabold tabular-nums text-green-700">{formatCurrency(financial.monthlyIncome)}</span>
                </div>
                <div className="flex items-end justify-between gap-3 border-b app-border py-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-neutral-400">Egresos</span>
                  <span className="text-[1rem] font-extrabold tabular-nums text-[#C0505A]">{formatCurrency(financial.monthlyExpense)}</span>
                </div>
                <div className="flex items-end justify-between gap-3 pt-3">
                  <span className="text-[0.7rem] font-bold uppercase tracking-[0.1em] text-neutral-400">Resultado</span>
                  <span className={`text-[1rem] font-extrabold tabular-nums ${resultPositive ? "text-green-700" : "text-[#C0505A]"}`}>{formatCurrency(financial.monthlyResult)}</span>
                </div>
              </div>
            </SectionCard>
          </div>

          {latestHealthRecords.length > 0 && (
            <SectionCard title="Sanidad reciente">
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {latestHealthRecords.slice(0, 3).map((record) => (
                  <div key={record.id} className="rounded-[12px] border app-border app-surface-soft px-3 py-3">
                    <div className="text-[0.78rem] font-bold text-neutral-900">{TREATMENT_LABEL[record.treatmentType] ?? record.treatmentType}</div>
                    <div className="mt-1 text-[0.7rem] text-neutral-400">{formatDateShort(record.date)} · {formatNumber(record.quantity)} animales</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </>
  );
}

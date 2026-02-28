import {
  PrismaClient,
  FinancialDirection,
  Currency,
  StockMovementType,
  LivestockMovementType,
  LivestockCategory,
  ObligationType,
  ObligationStatus,
  Role,
  FieldType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// ── Date helpers ─────────────────────────────────────────────────────────────

function dayOffset(days: number): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d;
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  // ── 1. Cleanup ─────────────────────────────────────────────────────────────
  console.log('── Limpiando tablas ──────────────────────────────────────────');
  await prisma.obligation.deleteMany();
  await prisma.financialMovement.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.livestockMovement.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.field.deleteMany();
  await prisma.user.deleteMany();
  console.log('✓ Tablas vacías\n');

  // ── 2. Users ───────────────────────────────────────────────────────────────
  console.log('── Usuarios ──────────────────────────────────────────────────');
  const [adminHash, viewerHash] = await Promise.all([
    bcrypt.hash('admin123', 10),
    bcrypt.hash('viewer123', 10),
  ]);

  await prisma.user.createMany({
    data: [
      { email: 'admin@atp.com', passwordHash: adminHash, role: Role.ADMIN },
      { email: 'viewer@atp.com', passwordHash: viewerHash, role: Role.VIEWER },
    ],
  });
  console.log('  admin@atp.com   / admin123  (ADMIN)');
  console.log('  viewer@atp.com  / viewer123 (VIEWER)\n');

  // ── 3. Field → Lot → Campaigns ────────────────────────────────────────────
  console.log('── Estructura agrícola ───────────────────────────────────────');
  const field = await prisma.field.create({
    data: { name: 'La Esperanza', type: FieldType.PROPIO },
  });

  const lot = await prisma.lot.create({
    data: { fieldId: field.id, surfaceHa: 200, location: 'Lote Norte' },
  });

  const [campaignSoja, campaignTrigo] = await Promise.all([
    prisma.campaign.create({ data: { lotId: lot.id, year: 2026, crop: 'soja' } }),
    prisma.campaign.create({ data: { lotId: lot.id, year: 2025, crop: 'trigo' } }),
  ]);

  console.log(`  Field:    ${field.name} (PROPIO)`);
  console.log(`  Lot:      ${lot.location} — ${lot.surfaceHa} ha`);
  console.log(`  Campaign: 2026 soja  (id: ${campaignSoja.id.slice(0, 8)}...)`);
  console.log(`  Campaign: 2025 trigo (id: ${campaignTrigo.id.slice(0, 8)}...)\n`);

  // ── 4. Stock Movements ────────────────────────────────────────────────────
  console.log('── Stock movements ───────────────────────────────────────────');

  // Soja 2026 (this month)
  await prisma.stockMovement.create({
    data: {
      product: 'soja', movementType: StockMovementType.HARVEST,
      quantity: 200, unit: 'tn',
      campaignId: campaignSoja.id, lotId: lot.id,
      createdAt: new Date('2026-02-01T08:00:00Z'),
    },
  });
  const smSojaPurchase = await prisma.stockMovement.create({
    data: {
      product: 'soja', movementType: StockMovementType.PURCHASE,
      quantity: 50, unit: 'tn',
      campaignId: campaignSoja.id, lotId: lot.id,
      createdAt: new Date('2026-02-05T10:00:00Z'),
    },
  });
  const smSojaSale = await prisma.stockMovement.create({
    data: {
      product: 'soja', movementType: StockMovementType.SALE,
      quantity: 80, unit: 'tn',
      campaignId: campaignSoja.id, lotId: lot.id,
      createdAt: new Date('2026-02-10T14:00:00Z'),
    },
  });
  await prisma.stockMovement.create({
    data: {
      product: 'soja', movementType: StockMovementType.INTERNAL_CONSUMPTION,
      quantity: 10, unit: 'tn',
      campaignId: campaignSoja.id, lotId: lot.id,
      createdAt: new Date('2026-02-15T09:00:00Z'),
    },
  });

  // Trigo 2025 (last month)
  await prisma.stockMovement.create({
    data: {
      product: 'trigo', movementType: StockMovementType.HARVEST,
      quantity: 150, unit: 'tn',
      campaignId: campaignTrigo.id, lotId: lot.id,
      createdAt: new Date('2026-01-10T08:00:00Z'),
    },
  });
  const smTrigoSale = await prisma.stockMovement.create({
    data: {
      product: 'trigo', movementType: StockMovementType.SALE,
      quantity: 60, unit: 'tn',
      campaignId: campaignTrigo.id, lotId: lot.id,
      createdAt: new Date('2026-01-20T11:00:00Z'),
    },
  });

  //
  //  Soja 2026:  HARVEST 200 + PURCHASE 50 - SALE 80 - CONSUMPTION 10 = 160 tn
  //  Trigo 2025: HARVEST 150 - SALE 60                                  =  90 tn
  //  ─────────────────────────────────────────────────────────────────────────
  //  TOTAL NET STOCK:                                                   = 250 tn
  //
  console.log('  [Feb 01]  soja   HARVEST        +200 tn');
  console.log('  [Feb 05]  soja   PURCHASE        +50 tn');
  console.log('  [Feb 10]  soja   SALE            -80 tn');
  console.log('  [Feb 15]  soja   CONSUMPTION     -10 tn');
  console.log('             → Net soja 2026:      160 tn');
  console.log('  [Jan 10]  trigo  HARVEST        +150 tn');
  console.log('  [Jan 20]  trigo  SALE            -60 tn');
  console.log('             → Net trigo 2025:      90 tn');
  console.log('             → TOTAL NET STOCK:    250 tn\n');

  // ── 5. Financial Movements ────────────────────────────────────────────────
  console.log('── Financial movements ───────────────────────────────────────');

  // Feb (this month) — contribuyen al monthlyIncome/Expense
  await prisma.financialMovement.create({
    data: {
      direction: FinancialDirection.EXPENSE, category: 'STOCK_PURCHASE',
      amount: 800000, currency: Currency.ARS,
      exchangeRateAtCreation: 1, baseCurrencyAmount: 800000,
      stockMovementId: smSojaPurchase.id, campaignId: campaignSoja.id,
      createdAt: new Date('2026-02-05T10:00:00Z'),
    },
  });
  const fmSojaSale = await prisma.financialMovement.create({
    data: {
      direction: FinancialDirection.INCOME, category: 'STOCK_SALE',
      amount: 4000000, currency: Currency.ARS,
      exchangeRateAtCreation: 1, baseCurrencyAmount: 4000000,
      stockMovementId: smSojaSale.id, campaignId: campaignSoja.id,
      createdAt: new Date('2026-02-10T14:00:00Z'),
    },
  });
  const fmCattleSale = await prisma.financialMovement.create({
    data: {
      direction: FinancialDirection.INCOME, category: 'CATTLE_SALE',
      amount: 1500000, currency: Currency.ARS,
      exchangeRateAtCreation: 1, baseCurrencyAmount: 1500000,
      createdAt: new Date('2026-02-12T12:00:00Z'),
    },
  });

  // Jan (last month) — no cuentan en el mes actual
  await prisma.financialMovement.create({
    data: {
      direction: FinancialDirection.EXPENSE, category: 'STOCK_PURCHASE',
      amount: 500000, currency: Currency.ARS,
      exchangeRateAtCreation: 1, baseCurrencyAmount: 500000,
      campaignId: campaignTrigo.id,
      createdAt: new Date('2026-01-05T09:00:00Z'),
    },
  });
  await prisma.financialMovement.create({
    data: {
      direction: FinancialDirection.INCOME, category: 'STOCK_SALE',
      amount: 2400000, currency: Currency.ARS,
      exchangeRateAtCreation: 1, baseCurrencyAmount: 2400000,
      stockMovementId: smTrigoSale.id, campaignId: campaignTrigo.id,
      createdAt: new Date('2026-01-20T11:00:00Z'),
    },
  });

  // Jan 31: pago de obligación → usado por la obligation PAID
  const fmObligationPaid = await prisma.financialMovement.create({
    data: {
      direction: FinancialDirection.EXPENSE, category: 'OBLIGATION_RENT',
      amount: 150000, currency: Currency.ARS,
      exchangeRateAtCreation: 1, baseCurrencyAmount: 150000,
      createdAt: new Date('2026-01-31T16:00:00Z'),
    },
  });

  console.log('  [Feb 05]  EXPENSE   800,000  STOCK_PURCHASE (soja)');
  console.log('  [Feb 10]  INCOME  4,000,000  STOCK_SALE (soja)');
  console.log('  [Feb 12]  INCOME  1,500,000  CATTLE_SALE (novillos)');
  console.log('  [Jan 05]  EXPENSE   500,000  STOCK_PURCHASE (trigo)');
  console.log('  [Jan 20]  INCOME  2,400,000  STOCK_SALE (trigo)');
  console.log('  [Jan 31]  EXPENSE   150,000  OBLIGATION_RENT (paid)');
  console.log('');
  console.log('  Mes actual (Feb 2026):');
  console.log('    monthlyIncome:   5,500,000 ARS  (4,000,000 + 1,500,000)');
  console.log('    monthlyExpense:    800,000 ARS');
  console.log('    monthlyResult:   4,700,000 ARS\n');

  // ── 6. Livestock Movements ────────────────────────────────────────────────
  console.log('── Livestock movements ───────────────────────────────────────');

  await prisma.livestockMovement.createMany({
    data: [
      // Dic 2025: ingreso inicial del rodeo
      { date: new Date('2025-12-01'), category: LivestockCategory.VACAS,    type: LivestockMovementType.INCOME,     quantity:  30 },
      { date: new Date('2025-12-01'), category: LivestockCategory.TOROS,    type: LivestockMovementType.INCOME,     quantity:   5 },
      // Ene 2026: compra de hacienda
      { date: new Date('2026-01-15'), category: LivestockCategory.TERNEROS, type: LivestockMovementType.INCOME,     quantity: 100 },
      { date: new Date('2026-01-20'), category: LivestockCategory.NOVILLOS, type: LivestockMovementType.INCOME,     quantity:  50 },
      // Feb 2026: operaciones
      { date: new Date('2026-02-12'), category: LivestockCategory.NOVILLOS, type: LivestockMovementType.SALE,       quantity:  20, totalPrice: 1500000 },
      { date: new Date('2026-02-20'), category: LivestockCategory.TERNEROS, type: LivestockMovementType.DEATH,      quantity:   3, notes: 'Mortalidad neonatal' },
      { date: new Date('2026-02-25'), category: LivestockCategory.VACAS,    type: LivestockMovementType.ADJUSTMENT, quantity:  -2, notes: 'Corrección reconteo' },
    ],
  });

  //
  //  INCOME:     30 (VACAS) + 5 (TOROS) + 100 (TERNEROS) + 50 (NOVILLOS) = 185
  //  SALE:      -20 (NOVILLOS)
  //  DEATH:      -3 (TERNEROS)
  //  ADJUSTMENT: -2 (VACAS, qty negativo)
  //  ──────────────────────────────────────────────────────────────────────────
  //  TOTAL HEADS:                                                          160
  //
  console.log('  [Dic 25]  INCOME     VACAS      +30');
  console.log('  [Dic 25]  INCOME     TOROS       +5');
  console.log('  [Ene 26]  INCOME     TERNEROS  +100');
  console.log('  [Ene 26]  INCOME     NOVILLOS   +50');
  console.log('             → Subtotal INCOME:    185');
  console.log('  [Feb 26]  SALE       NOVILLOS   -20  ($1,500,000)');
  console.log('  [Feb 26]  DEATH      TERNEROS    -3  (mortalidad)');
  console.log('  [Feb 26]  ADJUSTMENT VACAS       -2  (reconteo)');
  console.log('             → TOTAL CABEZAS:      160\n');

  // ── 7. Obligations ────────────────────────────────────────────────────────
  console.log('── Obligations ───────────────────────────────────────────────');

  await prisma.obligation.createMany({
    data: [
      {
        concept: 'Arrendamiento Lote Norte — Dic 2025',
        amount: 50000, type: ObligationType.RENT,
        status: ObligationStatus.PENDING,
        dueDate: dayOffset(-7),   // vencida → URGENT
      },
      {
        concept: 'Proveedor semillas ACA',
        amount: 120000, type: ObligationType.SUPPLIER,
        status: ObligationStatus.PENDING,
        dueDate: dayOffset(3),    // 3 días → URGENT
      },
      {
        concept: 'Cuota crédito maquinaria — Banco Nación',
        amount: 200000, type: ObligationType.CREDIT,
        status: ObligationStatus.PENDING,
        dueDate: dayOffset(15),   // 15 días → UPCOMING
      },
      {
        concept: 'Servicio veterinario — Dr. Pérez',
        amount: 80000, type: ObligationType.OTHER,
        status: ObligationStatus.PENDING,
        dueDate: dayOffset(25),   // 25 días → UPCOMING
      },
    ],
  });

  // PAID con financialMovementId (requiere create individual por la FK)
  await prisma.obligation.create({
    data: {
      concept: 'Arrendamiento Lote Norte — Nov 2025',
      amount: 150000, type: ObligationType.RENT,
      status: ObligationStatus.PAID,
      dueDate: dayOffset(-30),    // pagada hace 30 días
      financialMovementId: fmObligationPaid.id,
    },
  });

  console.log('  [today-7d]  RENT     $50,000  PENDING  → URGENT   (vencida)');
  console.log('  [today+3d]  SUPPLIER $120,000 PENDING  → URGENT');
  console.log('  [today+15d] CREDIT   $200,000 PENDING  → UPCOMING');
  console.log('  [today+25d] OTHER    $80,000  PENDING  → UPCOMING');
  console.log('  [today-30d] RENT     $150,000 PAID     → linked fmId\n');

  // ── Resumen esperado ──────────────────────────────────────────────────────
  console.log('══════════════════════════════════════════════════════════════');
  console.log('SEED OK — valores esperados en GET /dashboard:');
  console.log('══════════════════════════════════════════════════════════════');
  console.log('  stock.totalNetStock           250 tn');
  console.log('  livestock.totalHeads          160 cabezas');
  console.log('  financial.monthlyIncome       5,500,000 ARS');
  console.log('  financial.monthlyExpense        800,000 ARS');
  console.log('  financial.monthlyResult       4,700,000 ARS');
  console.log('  obligations.urgent            2  (vencida + +3d)');
  console.log('  obligations.upcoming          2  (+15d y +25d)');
  console.log('  lastMovements                 10 items (mezclados)');
  console.log('──────────────────────────────────────────────────────────────');
  console.log('  GET /hacienda/dashboard:');
  console.log('  totalHeads                    160');
  console.log('  byCategory.TERNEROS           97  (100 - 3)');
  console.log('  byCategory.NOVILLOS           30  (50 - 20)');
  console.log('  byCategory.VACAS              28  (30 - 2)');
  console.log('  byCategory.TOROS               5');
  console.log('  totalCattleSaleIncome         1,500,000 ARS');
  console.log('══════════════════════════════════════════════════════════════');
}

main()
  .catch((e) => {
    console.error('\n✗ Seed falló:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

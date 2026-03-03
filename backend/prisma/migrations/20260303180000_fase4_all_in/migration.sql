-- ─── New Enums ───────────────────────────────────────────────────────────────

CREATE TYPE "LivestockCategoryV2" AS ENUM ('TERNERO', 'TERNERA', 'NOVILLO', 'VAQUILLONA', 'TORO', 'VACA');

CREATE TYPE "ProviderType" AS ENUM ('INTERNO', 'EXTERNO');

CREATE TYPE "ThirdPartyWorkStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- Extend ThirdPartyWorkType (additive)
ALTER TYPE "ThirdPartyWorkType" ADD VALUE IF NOT EXISTS 'FERTILIZACION';
ALTER TYPE "ThirdPartyWorkType" ADD VALUE IF NOT EXISTS 'MOVIMIENTO_SUELO';

-- ─── Soft-delete: deletedAt columns ──────────────────────────────────────────

ALTER TABLE "stock_movements"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "unit_price" DECIMAL(14,2),
  ADD COLUMN IF NOT EXISTS "notes" TEXT;

ALTER TABLE "financial_movements"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

ALTER TABLE "livestock_movements"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "category_v2" "LivestockCategoryV2";

ALTER TABLE "livestock_health_records"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "applies_to_all" BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS "total_cost" DECIMAL(14,2),
  ADD COLUMN IF NOT EXISTS "cost_per_head" DECIMAL(14,2);

ALTER TABLE "obligations"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

ALTER TABLE "salary_payments"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

ALTER TABLE "salary_advances"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3);

ALTER TABLE "third_party_works"
  ADD COLUMN IF NOT EXISTS "deleted_at" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "provider_type" "ProviderType" NOT NULL DEFAULT 'EXTERNO',
  ADD COLUMN IF NOT EXISTS "status" "ThirdPartyWorkStatus" NOT NULL DEFAULT 'PENDING';

-- ─── Indexes for deletedAt ────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS "stock_movements_deleted_at_idx" ON "stock_movements"("deleted_at");
CREATE INDEX IF NOT EXISTS "financial_movements_deleted_at_idx" ON "financial_movements"("deleted_at");
CREATE INDEX IF NOT EXISTS "livestock_movements_deleted_at_idx" ON "livestock_movements"("deleted_at");
CREATE INDEX IF NOT EXISTS "livestock_health_records_deleted_at_idx" ON "livestock_health_records"("deleted_at");
CREATE INDEX IF NOT EXISTS "obligations_deleted_at_idx" ON "obligations"("deleted_at");
CREATE INDEX IF NOT EXISTS "salary_payments_deleted_at_idx" ON "salary_payments"("deleted_at");
CREATE INDEX IF NOT EXISTS "salary_advances_deleted_at_idx" ON "salary_advances"("deleted_at");
CREATE INDEX IF NOT EXISTS "third_party_works_deleted_at_idx" ON "third_party_works"("deleted_at");

-- ─── Lease Contracts ─────────────────────────────────────────────────────────

CREATE TABLE "lease_contracts" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "total_quintales" DECIMAL(14,2) NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lease_contracts_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lease_contracts_field_id_idx" ON "lease_contracts"("field_id");
CREATE INDEX "lease_contracts_deleted_at_idx" ON "lease_contracts"("deleted_at");

ALTER TABLE "lease_contracts"
  ADD CONSTRAINT "lease_contracts_field_id_fkey"
  FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─── Lease Deliveries ─────────────────────────────────────────────────────────

CREATE TABLE "lease_deliveries" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "quintales" DECIMAL(14,2) NOT NULL,
    "amount_ars" DECIMAL(14,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "financial_movement_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lease_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "lease_deliveries_contract_id_idx" ON "lease_deliveries"("contract_id");
CREATE INDEX "lease_deliveries_deleted_at_idx" ON "lease_deliveries"("deleted_at");

ALTER TABLE "lease_deliveries"
  ADD CONSTRAINT "lease_deliveries_contract_id_fkey"
  FOREIGN KEY ("contract_id") REFERENCES "lease_contracts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

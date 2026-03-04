-- Agregar valor PURCHASE al enum LivestockMovementType
ALTER TYPE "LivestockMovementType" ADD VALUE 'PURCHASE';

-- Nuevos campos en livestock_movements para cálculo por kilo
ALTER TABLE "livestock_movements"
  ADD COLUMN "avg_weight_kg"   DECIMAL(10,3),
  ADD COLUMN "price_per_kg"    DECIMAL(14,2),
  ADD COLUMN "total_weight_kg" DECIMAL(14,3),
  ADD COLUMN "total_amount"    DECIMAL(14,2);

-- Nueva tabla de ítems de movimiento (distribución por categoría)
CREATE TABLE "livestock_movement_items" (
  "id"          TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  "movement_id" TEXT NOT NULL,
  "category"    "LivestockCategoryV2" NOT NULL,
  "quantity"    INTEGER NOT NULL,
  CONSTRAINT "livestock_movement_items_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "livestock_movement_items_movement_id_fkey"
    FOREIGN KEY ("movement_id") REFERENCES "livestock_movements"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX "livestock_movement_items_movement_id_idx"
  ON "livestock_movement_items"("movement_id");

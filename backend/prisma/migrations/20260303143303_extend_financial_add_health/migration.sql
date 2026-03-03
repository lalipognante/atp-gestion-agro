-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'TRANSFER', 'THIRD_PARTY_CHECK', 'QUINTALES', 'OTHER');

-- CreateEnum
CREATE TYPE "LivestockType" AS ENUM ('VACA', 'FEEDLOT', 'TERNERO');

-- CreateEnum
CREATE TYPE "TreatmentType" AS ENUM ('VACUNA', 'BAÑO', 'DESPARASITACION', 'OTRO');

-- AlterTable
ALTER TABLE "financial_movements" ADD COLUMN     "counterparty" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "payment_method" "PaymentMethod",
ADD COLUMN     "reference" TEXT;

-- CreateTable
CREATE TABLE "livestock_health_records" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "livestock_type" "LivestockType" NOT NULL,
    "treatment_type" "TreatmentType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DECIMAL(14,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestock_health_records_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "financial_movements_payment_method_idx" ON "financial_movements"("payment_method");

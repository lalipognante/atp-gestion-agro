/*
  Warnings:

  - You are about to drop the `input_movements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `livestock_movements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `market_prices` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `obligation_installments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment_plans` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "obligation_installments" DROP CONSTRAINT "obligation_installments_payment_plan_id_fkey";

-- DropForeignKey
ALTER TABLE "payment_plans" DROP CONSTRAINT "payment_plans_supplier_id_fkey";

-- AlterTable
ALTER TABLE "financial_movements" ADD COLUMN     "campaign_id" TEXT;

-- DropTable
DROP TABLE "input_movements";

-- DropTable
DROP TABLE "livestock_movements";

-- DropTable
DROP TABLE "market_prices";

-- DropTable
DROP TABLE "obligation_installments";

-- DropTable
DROP TABLE "payment_plans";

-- DropTable
DROP TABLE "suppliers";

-- CreateIndex
CREATE INDEX "financial_movements_campaign_id_idx" ON "financial_movements"("campaign_id");

-- AddForeignKey
ALTER TABLE "financial_movements" ADD CONSTRAINT "financial_movements_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

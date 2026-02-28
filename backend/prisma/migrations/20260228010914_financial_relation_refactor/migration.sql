/*
  Warnings:

  - You are about to drop the column `related_id` on the `financial_movements` table. All the data in the column will be lost.
  - You are about to drop the column `related_type` on the `financial_movements` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "financial_movements" DROP COLUMN "related_id",
DROP COLUMN "related_type",
ADD COLUMN     "stock_movement_id" TEXT;

-- CreateIndex
CREATE INDEX "financial_movements_stock_movement_id_idx" ON "financial_movements"("stock_movement_id");

-- AddForeignKey
ALTER TABLE "financial_movements" ADD CONSTRAINT "financial_movements_stock_movement_id_fkey" FOREIGN KEY ("stock_movement_id") REFERENCES "stock_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

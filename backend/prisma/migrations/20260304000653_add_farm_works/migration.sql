-- CreateTable
CREATE TABLE "farm_works" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "work_type" "ThirdPartyWorkType" NOT NULL,
    "lot_id" TEXT NOT NULL,
    "responsible" TEXT,
    "cost" DECIMAL(14,2),
    "currency" "Currency",
    "notes" TEXT,
    "financial_movement_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "farm_works_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "farm_works_lot_id_idx" ON "farm_works"("lot_id");

-- CreateIndex
CREATE INDEX "farm_works_deleted_at_idx" ON "farm_works"("deleted_at");

-- AddForeignKey
ALTER TABLE "farm_works" ADD CONSTRAINT "farm_works_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

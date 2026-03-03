-- CreateEnum
CREATE TYPE "ThirdPartyWorkType" AS ENUM ('SIEMBRA', 'FUMIGACION', 'COSECHA');

-- CreateTable
CREATE TABLE "third_party_works" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "work_type" "ThirdPartyWorkType" NOT NULL,
    "lot_id" TEXT NOT NULL,
    "contractor" TEXT NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "amount" DECIMAL(14,2),
    "currency" "Currency",
    "quintales" DECIMAL(14,2),
    "grain_type" TEXT,
    "reference" TEXT,
    "notes" TEXT,
    "financial_movement_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "third_party_works_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "third_party_works_lot_id_idx" ON "third_party_works"("lot_id");

-- AddForeignKey
ALTER TABLE "third_party_works" ADD CONSTRAINT "third_party_works_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

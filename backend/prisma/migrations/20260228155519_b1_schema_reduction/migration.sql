/*
  Warnings:

  - You are about to drop the `audit_logs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loan_installments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `loans` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "LivestockCategory" AS ENUM ('TERNEROS', 'NOVILLOS', 'VACAS', 'TOROS');

-- CreateEnum
CREATE TYPE "ObligationType" AS ENUM ('RENT', 'CREDIT', 'SUPPLIER', 'OTHER');

-- CreateEnum
CREATE TYPE "ObligationStatus" AS ENUM ('PENDING', 'PAID');

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_changed_by_user_id_fkey";

-- DropForeignKey
ALTER TABLE "loan_installments" DROP CONSTRAINT "loan_installments_financial_movement_id_fkey";

-- DropForeignKey
ALTER TABLE "loan_installments" DROP CONSTRAINT "loan_installments_loan_id_fkey";

-- DropTable
DROP TABLE "audit_logs";

-- DropTable
DROP TABLE "loan_installments";

-- DropTable
DROP TABLE "loans";

-- DropEnum
DROP TYPE "AuditAction";

-- DropEnum
DROP TYPE "InputMovementType";

-- DropEnum
DROP TYPE "InstallmentStatus";

-- DropEnum
DROP TYPE "MarketPriceSource";

-- DropEnum
DROP TYPE "MarketPriceType";

-- CreateTable
CREATE TABLE "livestock_movements" (
    "id" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "category" "LivestockCategory" NOT NULL,
    "type" "LivestockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "total_price" DECIMAL(14,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligations" (
    "id" TEXT NOT NULL,
    "concept" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "due_date" DATE NOT NULL,
    "type" "ObligationType" NOT NULL,
    "status" "ObligationStatus" NOT NULL,
    "financial_movement_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obligations_pkey" PRIMARY KEY ("id")
);

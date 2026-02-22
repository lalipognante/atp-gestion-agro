-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'VIEWER');

-- CreateEnum
CREATE TYPE "FieldType" AS ENUM ('PROPIO', 'ALQUILADO');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('HARVEST', 'PURCHASE', 'SALE', 'TRANSFER', 'ADJUSTMENT', 'INTERNAL_CONSUMPTION');

-- CreateEnum
CREATE TYPE "LivestockMovementType" AS ENUM ('INCOME', 'SALE', 'DEATH', 'TRANSFER', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "InputMovementType" AS ENUM ('PURCHASE', 'USAGE', 'ADJUSTMENT');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('ARS', 'USD');

-- CreateEnum
CREATE TYPE "InstallmentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL');

-- CreateEnum
CREATE TYPE "FinancialDirection" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "MarketPriceType" AS ENUM ('GRAIN', 'CATTLE', 'USD');

-- CreateEnum
CREATE TYPE "MarketPriceSource" AS ENUM ('MANUAL', 'API');

-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "FieldType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lots" (
    "id" TEXT NOT NULL,
    "field_id" TEXT NOT NULL,
    "surface_ha" DECIMAL(10,2) NOT NULL,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "lot_id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "crop" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stock_movements" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "movement_type" "StockMovementType" NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "lot_id" TEXT,
    "campaign_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "livestock_movements" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "movement_type" "LivestockMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "livestock_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "input_movements" (
    "id" TEXT NOT NULL,
    "product" TEXT NOT NULL,
    "movement_type" "InputMovementType" NOT NULL,
    "quantity" DECIMAL(14,2) NOT NULL,
    "unit" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "input_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contact_info" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_plans" (
    "id" TEXT NOT NULL,
    "supplier_id" TEXT,
    "related_type" TEXT,
    "related_id" TEXT,
    "total_installments" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "obligation_installments" (
    "id" TEXT NOT NULL,
    "payment_plan_id" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "exchange_rate_at_creation" DECIMAL(14,6) NOT NULL,
    "base_currency_amount" DECIMAL(14,2) NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "InstallmentStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "obligation_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "financial_movements" (
    "id" TEXT NOT NULL,
    "direction" "FinancialDirection" NOT NULL,
    "category" TEXT,
    "amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "exchange_rate_at_creation" DECIMAL(14,6) NOT NULL,
    "base_currency_amount" DECIMAL(14,2) NOT NULL,
    "related_type" TEXT,
    "related_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "financial_movements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loans" (
    "id" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "principal_amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "exchange_rate_at_creation" DECIMAL(14,6) NOT NULL,
    "base_currency_amount" DECIMAL(14,2) NOT NULL,
    "interest_rate" DECIMAL(5,2) NOT NULL,
    "total_installments" INTEGER NOT NULL,
    "start_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_installments" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "capital_amount" DECIMAL(14,2) NOT NULL,
    "interest_amount" DECIMAL(14,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "exchange_rate_at_creation" DECIMAL(14,6) NOT NULL,
    "base_currency_capital_amount" DECIMAL(14,2) NOT NULL,
    "base_currency_interest_amount" DECIMAL(14,2) NOT NULL,
    "base_currency_amount" DECIMAL(14,2) NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "InstallmentStatus" NOT NULL,
    "financial_movement_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_installments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "market_prices" (
    "id" TEXT NOT NULL,
    "type" "MarketPriceType" NOT NULL,
    "product" TEXT NOT NULL,
    "price" DECIMAL(14,4) NOT NULL,
    "currency" "Currency" NOT NULL,
    "date" DATE NOT NULL,
    "source" "MarketPriceSource" NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "market_prices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "action" "AuditAction" NOT NULL,
    "changed_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "stock_movements_product_idx" ON "stock_movements"("product");

-- CreateIndex
CREATE INDEX "livestock_movements_category_idx" ON "livestock_movements"("category");

-- CreateIndex
CREATE INDEX "obligation_installments_due_date_idx" ON "obligation_installments"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "loan_installments_financial_movement_id_key" ON "loan_installments"("financial_movement_id");

-- CreateIndex
CREATE INDEX "loan_installments_due_date_idx" ON "loan_installments"("due_date");

-- CreateIndex
CREATE INDEX "loan_installments_loan_id_idx" ON "loan_installments"("loan_id");

-- CreateIndex
CREATE INDEX "market_prices_product_active_idx" ON "market_prices"("product", "active");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- AddForeignKey
ALTER TABLE "lots" ADD CONSTRAINT "lots_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_lot_id_fkey" FOREIGN KEY ("lot_id") REFERENCES "lots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movements" ADD CONSTRAINT "stock_movements_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_plans" ADD CONSTRAINT "payment_plans_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "obligation_installments" ADD CONSTRAINT "obligation_installments_payment_plan_id_fkey" FOREIGN KEY ("payment_plan_id") REFERENCES "payment_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_installments" ADD CONSTRAINT "loan_installments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_installments" ADD CONSTRAINT "loan_installments_financial_movement_id_fkey" FOREIGN KEY ("financial_movement_id") REFERENCES "financial_movements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_changed_by_user_id_fkey" FOREIGN KEY ("changed_by_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

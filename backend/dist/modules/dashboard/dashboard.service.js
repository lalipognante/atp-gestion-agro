"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getSummary() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const in7Days = new Date(today);
        in7Days.setDate(in7Days.getDate() + 7);
        const in30Days = new Date(today);
        in30Days.setDate(in30Days.getDate() + 30);
        const [allStock, allLivestock, monthlyFinancial, urgentObligations, upcomingObligations, recentFinancial, recentLivestock, recentStock,] = await Promise.all([
            this.prisma.stockMovement.findMany(),
            this.prisma.livestockMovement.findMany(),
            this.prisma.financialMovement.findMany({
                where: { createdAt: { gte: startOfMonth, lt: startOfNextMonth } },
            }),
            this.prisma.obligation.findMany({
                where: {
                    status: client_1.ObligationStatus.PENDING,
                    dueDate: { lte: in7Days },
                },
                orderBy: { dueDate: 'asc' },
            }),
            this.prisma.obligation.findMany({
                where: {
                    status: client_1.ObligationStatus.PENDING,
                    dueDate: { gt: in7Days, lte: in30Days },
                },
                orderBy: { dueDate: 'asc' },
            }),
            this.prisma.financialMovement.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
            this.prisma.livestockMovement.findMany({
                orderBy: { date: 'desc' },
                take: 10,
            }),
            this.prisma.stockMovement.findMany({
                orderBy: { createdAt: 'desc' },
                take: 10,
            }),
        ]);
        let totalNetStock = 0;
        for (const m of allStock) {
            const qty = Number(m.quantity);
            switch (m.movementType) {
                case client_1.StockMovementType.HARVEST:
                case client_1.StockMovementType.PURCHASE:
                    totalNetStock += qty;
                    break;
                case client_1.StockMovementType.SALE:
                case client_1.StockMovementType.INTERNAL_CONSUMPTION:
                    totalNetStock -= qty;
                    break;
                case client_1.StockMovementType.ADJUSTMENT:
                    totalNetStock += qty;
                    break;
            }
        }
        let totalHeads = 0;
        for (const m of allLivestock) {
            const qty = m.quantity;
            switch (m.type) {
                case client_1.LivestockMovementType.INCOME:
                    totalHeads += qty;
                    break;
                case client_1.LivestockMovementType.SALE:
                case client_1.LivestockMovementType.DEATH:
                case client_1.LivestockMovementType.TRANSFER:
                    totalHeads -= qty;
                    break;
                case client_1.LivestockMovementType.ADJUSTMENT:
                    totalHeads += qty;
                    break;
            }
        }
        let monthlyIncome = 0;
        let monthlyExpense = 0;
        for (const m of monthlyFinancial) {
            const amount = Number(m.baseCurrencyAmount);
            if (m.direction === client_1.FinancialDirection.INCOME) {
                monthlyIncome += amount;
            }
            else {
                monthlyExpense += amount;
            }
        }
        const combined = [
            ...recentFinancial.map((m) => ({
                id: m.id,
                source: 'financial',
                date: m.createdAt,
                description: m.category ?? m.direction,
                direction: m.direction,
                amount: Number(m.baseCurrencyAmount),
                currency: m.currency,
            })),
            ...recentLivestock.map((m) => ({
                id: m.id,
                source: 'livestock',
                date: m.date,
                description: `${m.type} · ${m.category}`,
                quantity: m.quantity,
                totalPrice: m.totalPrice != null ? Number(m.totalPrice) : null,
            })),
            ...recentStock.map((m) => ({
                id: m.id,
                source: 'stock',
                date: m.createdAt,
                description: `${m.movementType} · ${m.product}`,
                quantity: Number(m.quantity),
                unit: m.unit,
            })),
        ];
        combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        return {
            stock: {
                totalNetStock,
            },
            livestock: {
                totalHeads,
            },
            financial: {
                monthlyIncome,
                monthlyExpense,
                monthlyResult: monthlyIncome - monthlyExpense,
            },
            obligations: {
                urgent: urgentObligations,
                upcoming: upcomingObligations,
            },
            lastMovements: combined.slice(0, 10),
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map
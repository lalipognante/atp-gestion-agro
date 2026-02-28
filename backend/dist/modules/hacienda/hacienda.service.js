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
exports.HaciendaService = void 0;
const common_1 = require("@nestjs/common");
const hacienda_repository_1 = require("./hacienda.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let HaciendaService = class HaciendaService {
    repo;
    prisma;
    constructor(repo, prisma) {
        this.repo = repo;
        this.prisma = prisma;
    }
    async create(dto) {
        const isSaleWithPrice = dto.type === client_1.LivestockMovementType.SALE && dto.totalPrice != null;
        if (isSaleWithPrice) {
            return this.prisma.$transaction(async (tx) => {
                const movement = await tx.livestockMovement.create({
                    data: {
                        date: new Date(dto.date),
                        category: dto.category,
                        type: dto.type,
                        quantity: dto.quantity,
                        totalPrice: dto.totalPrice,
                        notes: dto.notes ?? null,
                    },
                });
                await tx.financialMovement.create({
                    data: {
                        direction: client_1.FinancialDirection.INCOME,
                        category: 'CATTLE_SALE',
                        amount: dto.totalPrice,
                        currency: client_1.Currency.ARS,
                        exchangeRateAtCreation: 1,
                        baseCurrencyAmount: dto.totalPrice,
                    },
                });
                return movement;
            });
        }
        return this.repo.create(dto);
    }
    async getDashboard() {
        const movements = await this.repo.findAll();
        let totalHeads = 0;
        const byCategory = {};
        let totalCattleSaleIncome = 0;
        for (const m of movements) {
            const qty = m.quantity;
            const cat = m.category;
            if (m.type === client_1.LivestockMovementType.INCOME) {
                totalHeads += qty;
                byCategory[cat] = (byCategory[cat] ?? 0) + qty;
            }
            else if (m.type === client_1.LivestockMovementType.SALE ||
                m.type === client_1.LivestockMovementType.DEATH ||
                m.type === client_1.LivestockMovementType.TRANSFER) {
                totalHeads -= qty;
                byCategory[cat] = (byCategory[cat] ?? 0) - qty;
            }
            if (m.type === client_1.LivestockMovementType.SALE && m.totalPrice != null) {
                totalCattleSaleIncome += Number(m.totalPrice);
            }
        }
        return {
            totalHeads,
            byCategory,
            totalCattleSaleIncome,
        };
    }
};
exports.HaciendaService = HaciendaService;
exports.HaciendaService = HaciendaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [hacienda_repository_1.HaciendaRepository,
        prisma_service_1.PrismaService])
], HaciendaService);
//# sourceMappingURL=hacienda.service.js.map
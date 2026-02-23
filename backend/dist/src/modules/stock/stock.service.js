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
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const stock_repository_1 = require("./stock.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let StockService = class StockService {
    stockRepository;
    prisma;
    constructor(stockRepository, prisma) {
        this.stockRepository = stockRepository;
        this.prisma = prisma;
    }
    async create(dto) {
        const campaign = await this.stockRepository.campaignExists(dto.campaignId);
        if (!campaign) {
            throw new common_1.NotFoundException('Campaign not found');
        }
        const summary = await this.getSummary(dto.campaignId);
        const currentStock = summary.netStock;
        const qty = Number(dto.quantity);
        if (dto.movementType === 'SALE' ||
            dto.movementType === 'INTERNAL_CONSUMPTION') {
            if (qty > currentStock) {
                throw new common_1.BadRequestException(`Insufficient stock. Current stock: ${currentStock}`);
            }
        }
        const stockMovement = await this.stockRepository.create(dto);
        if (dto.movementType === 'SALE' || dto.movementType === 'PURCHASE') {
            if (!dto.pricePerUnit) {
                throw new common_1.BadRequestException('pricePerUnit required for SALE or PURCHASE');
            }
            const amount = qty * dto.pricePerUnit;
            await this.prisma.financialMovement.create({
                data: {
                    direction: dto.movementType === 'SALE'
                        ? client_1.FinancialDirection.INCOME
                        : client_1.FinancialDirection.EXPENSE,
                    category: 'STOCK_' + dto.movementType,
                    amount,
                    currency: client_1.Currency.ARS,
                    exchangeRateAtCreation: 1,
                    baseCurrencyAmount: amount,
                    relatedType: 'STOCK_MOVEMENT',
                    relatedId: stockMovement.id,
                },
            });
        }
        return stockMovement;
    }
    async findAll() {
        return this.stockRepository.findAll();
    }
    async getSummary(campaignId) {
        const movements = await this.stockRepository.findByCampaign(campaignId);
        if (!movements.length) {
            return {
                product: null,
                harvest: 0,
                purchase: 0,
                sale: 0,
                internalConsumption: 0,
                adjustment: 0,
                netStock: 0,
            };
        }
        let harvest = 0;
        let purchase = 0;
        let sale = 0;
        let internalConsumption = 0;
        let adjustment = 0;
        for (const m of movements) {
            const qty = Number(m.quantity);
            switch (m.movementType) {
                case 'HARVEST':
                    harvest += qty;
                    break;
                case 'PURCHASE':
                    purchase += qty;
                    break;
                case 'SALE':
                    sale += qty;
                    break;
                case 'INTERNAL_CONSUMPTION':
                    internalConsumption += qty;
                    break;
                case 'ADJUSTMENT':
                    adjustment += qty;
                    break;
            }
        }
        const netStock = harvest +
            purchase +
            adjustment -
            sale -
            internalConsumption;
        return {
            product: movements[0].product,
            harvest,
            purchase,
            sale,
            internalConsumption,
            adjustment,
            netStock,
        };
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [stock_repository_1.StockRepository,
        prisma_service_1.PrismaService])
], StockService);
//# sourceMappingURL=stock.service.js.map
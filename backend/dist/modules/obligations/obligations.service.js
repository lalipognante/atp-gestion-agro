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
exports.ObligationsService = void 0;
const common_1 = require("@nestjs/common");
const obligations_repository_1 = require("./obligations.repository");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ObligationsService = class ObligationsService {
    repo;
    prisma;
    constructor(repo, prisma) {
        this.repo = repo;
        this.prisma = prisma;
    }
    async create(dto) {
        return this.repo.create(dto);
    }
    async findAll() {
        return this.repo.findAll();
    }
    async pay(id) {
        const obligation = await this.repo.findById(id);
        if (!obligation) {
            throw new common_1.NotFoundException('Obligation not found');
        }
        if (obligation.status === client_1.ObligationStatus.PAID) {
            throw new common_1.BadRequestException('Obligation is already paid');
        }
        return this.prisma.$transaction(async (tx) => {
            const financialMovement = await tx.financialMovement.create({
                data: {
                    direction: client_1.FinancialDirection.EXPENSE,
                    category: 'OBLIGATION_' + obligation.type,
                    amount: obligation.amount,
                    currency: client_1.Currency.ARS,
                    exchangeRateAtCreation: 1,
                    baseCurrencyAmount: obligation.amount,
                },
            });
            return tx.obligation.update({
                where: { id },
                data: {
                    status: client_1.ObligationStatus.PAID,
                    financialMovementId: financialMovement.id,
                },
            });
        });
    }
};
exports.ObligationsService = ObligationsService;
exports.ObligationsService = ObligationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [obligations_repository_1.ObligationsRepository,
        prisma_service_1.PrismaService])
], ObligationsService);
//# sourceMappingURL=obligations.service.js.map
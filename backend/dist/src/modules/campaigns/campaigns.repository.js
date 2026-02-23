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
exports.CampaignsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let CampaignsRepository = class CampaignsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.campaign.create({
            data,
        });
    }
    async findAll() {
        return this.prisma.campaign.findMany({
            include: {
                lot: {
                    include: {
                        field: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async lotExists(lotId) {
        return this.prisma.lot.findUnique({
            where: { id: lotId },
        });
    }
};
exports.CampaignsRepository = CampaignsRepository;
exports.CampaignsRepository = CampaignsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CampaignsRepository);
//# sourceMappingURL=campaigns.repository.js.map
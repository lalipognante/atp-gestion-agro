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
exports.LotsService = void 0;
const common_1 = require("@nestjs/common");
const lots_repository_1 = require("./lots.repository");
let LotsService = class LotsService {
    lotsRepository;
    constructor(lotsRepository) {
        this.lotsRepository = lotsRepository;
    }
    async create(dto) {
        const field = await this.lotsRepository.fieldExists(dto.fieldId);
        if (!field) {
            throw new common_1.NotFoundException('Field not found');
        }
        return this.lotsRepository.create(dto);
    }
    async findAll() {
        return this.lotsRepository.findAll();
    }
};
exports.LotsService = LotsService;
exports.LotsService = LotsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [lots_repository_1.LotsRepository])
], LotsService);
//# sourceMappingURL=lots.service.js.map
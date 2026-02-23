"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./modules/auth/auth.module");
const fields_module_1 = require("./modules/fields/fields.module");
const lots_module_1 = require("./modules/lots/lots.module");
const stock_module_1 = require("./modules/stock/stock.module");
const financial_module_1 = require("./modules/financial/financial.module");
const loans_module_1 = require("./modules/loans/loans.module");
const obligations_module_1 = require("./modules/obligations/obligations.module");
const pricing_module_1 = require("./modules/pricing/pricing.module");
const campaigns_module_1 = require("./modules/campaigns/campaigns.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            fields_module_1.FieldsModule,
            campaigns_module_1.CampaignsModule,
            lots_module_1.LotsModule,
            stock_module_1.StockModule,
            financial_module_1.FinancialModule,
            loans_module_1.LoansModule,
            obligations_module_1.ObligationsModule,
            pricing_module_1.PricingModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HaciendaModule = void 0;
const common_1 = require("@nestjs/common");
const hacienda_repository_1 = require("./hacienda.repository");
const hacienda_service_1 = require("./hacienda.service");
const hacienda_controller_1 = require("./hacienda.controller");
let HaciendaModule = class HaciendaModule {
};
exports.HaciendaModule = HaciendaModule;
exports.HaciendaModule = HaciendaModule = __decorate([
    (0, common_1.Module)({
        controllers: [hacienda_controller_1.HaciendaController],
        providers: [hacienda_repository_1.HaciendaRepository, hacienda_service_1.HaciendaService],
    })
], HaciendaModule);
//# sourceMappingURL=hacienda.module.js.map
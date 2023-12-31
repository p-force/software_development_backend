"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppController = void 0;
var common_1 = require("@nestjs/common");
var logger_interceptor_1 = require("../../common/modules/logger/logger.interceptor");
var swagger_1 = require("@nestjs/swagger");
var AppController = /** @class */ (function () {
    function AppController() {
    }
    AppController.prototype.getHello = function () {
        return "Version: ".concat(process.env.npm_package_version, " ");
    };
    __decorate([
        (0, common_1.Get)('')
    ], AppController.prototype, "getHello");
    AppController = __decorate([
        (0, swagger_1.ApiTags)('Application'),
        (0, common_1.UseInterceptors)(logger_interceptor_1.LoggerInterceptor),
        (0, common_1.Controller)({ version: '1' })
    ], AppController);
    return AppController;
}());
exports.AppController = AppController;

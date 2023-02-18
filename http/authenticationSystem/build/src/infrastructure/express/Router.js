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
exports.Router = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const UserVerifierController_1 = require("../../controller/UserVerifierController");
let Router = class Router {
    userVerifierController;
    constructor(userVerifierController) {
        this.userVerifierController = userVerifierController;
    }
    get routes() {
        const router = (0, express_1.Router)();
        router.get('/status', (req, res, next) => {
            res.json({
                message: 'ok'
            }).status(200);
        });
        router.post('/verify', this.userVerifierController.validateUser);
        return router;
    }
};
Router = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [UserVerifierController_1.UserVerifierController])
], Router);
exports.Router = Router;

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
exports.UserVerifierController = void 0;
const tsyringe_1 = require("tsyringe");
const VerificationService_1 = require("../services/VerificationService");
const zod_1 = require("zod");
let UserVerifierController = class UserVerifierController {
    verificationService;
    constructor(verificationService) {
        this.verificationService = verificationService;
    }
    async validateUser(request, response, next) {
        const bodySchema = zod_1.z.object({
            username: zod_1.z.string().min(5).max(30),
            password: zod_1.z.string().min(5).max(30)
        });
        const body = request.body;
        const parseResult = bodySchema.safeParse(body);
        if (parseResult.success === false) {
            response.json({
                error: `Error validating input: ${parseResult.error}`
            }).status(400);
            return;
        }
        const verficationResult = await this.verificationService.verifyUser({
            username: parseResult.data.username,
            password: parseResult.data.password
        });
        if (verficationResult) {
            response.json({
                message: 'Valid user!'
            }).status(200);
        }
        else {
            response.json({
                message: 'Invalid user :('
            }).status(400);
        }
        next();
    }
};
UserVerifierController = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [VerificationService_1.VerificationService])
], UserVerifierController);
exports.UserVerifierController = UserVerifierController;

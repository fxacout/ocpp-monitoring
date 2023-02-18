"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemUserRepository = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tsyringe_1 = require("tsyringe");
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String
}, {
    timestamps: true
});
const model = mongoose_1.default.model('user', userSchema);
let SystemUserRepository = class SystemUserRepository {
    async getUser(username) {
        const result = await model.find({ username }).lean().exec();
        if (result.length === 0) {
            throw Error(`Cannot find User with username ${username}`);
        }
        return this.mapFromDb(result[0]);
    }
    mapFromDb(user) {
        return new SystemUser(user.username, user.password);
    }
    async persistUser(username, password) {
        await model.create({
            username,
            password
        });
    }
};
SystemUserRepository = __decorate([
    (0, tsyringe_1.singleton)()
], SystemUserRepository);
exports.SystemUserRepository = SystemUserRepository;

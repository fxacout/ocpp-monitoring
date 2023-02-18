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
exports.DbConnection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const tsyringe_1 = require("tsyringe");
let DbConnection = class DbConnection {
    async connect() {
        mongoose_1.default.connect('mongodb://127.0.0.1:27017/users');
    }
};
DbConnection = __decorate([
    (0, tsyringe_1.singleton)()
], DbConnection);
exports.DbConnection = DbConnection;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const tsyringe_1 = require("tsyringe");
const DbConnection_1 = require("./DbConnection");
const Router_1 = require("./express/Router");
let Application = class Application {
    router;
    dbConnection;
    server;
    constructor(router, dbConnection) {
        this.router = router;
        this.dbConnection = dbConnection;
        this.dbConnection.connect().then(() => {
            console.log(`Database connected!`);
        });
        this.server = (0, express_1.default)();
    }
    listen() {
        this.server.use(body_parser_1.default.json());
        this.server.use(this.router.routes);
        this.server.listen('3000');
        console.log('Server listening on port 3000!');
    }
};
Application = __decorate([
    (0, tsyringe_1.singleton)(),
    __metadata("design:paramtypes", [Router_1.Router,
        DbConnection_1.DbConnection])
], Application);
exports.Application = Application;

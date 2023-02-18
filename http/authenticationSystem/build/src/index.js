"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const tsyringe_1 = require("tsyringe");
const Application_1 = require("./infrastructure/Application");
const app = tsyringe_1.container.resolve(Application_1.Application);
app.listen();

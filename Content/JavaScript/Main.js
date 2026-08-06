"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puerts = require("puerts");
const puerts_runtime_1 = require("@matrix/puerts-runtime");
const gameInstance = puerts.argv.getByName("GameInstance");
const runtime = new puerts_runtime_1.GameplayRuntime(gameInstance);
runtime.start();
console.log("GameplayRuntime start");
//# sourceMappingURL=Main.js.map
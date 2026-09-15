"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puerts_1 = require("puerts");
// Get arguments passed from C++ (see ULyraGameInstance::OnStart)
const gameInstance = puerts_1.argv.getByName("GameInstance");
console.log('========================================');
console.log('Puerts TypeScript Loaded Successfully!');
console.log('GameInstance:', gameInstance);
console.log('========================================');
//# sourceMappingURL=Main.js.map
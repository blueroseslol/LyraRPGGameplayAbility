/// <reference path="../Typing/puerts/index.d.ts" />
/// <reference path="../Typing/ue/index.d.ts" />

// Globals provided by the Puerts runtime (V8 / Node.js).
declare const console: {
    log(...args: any[]): void;
    error(...args: any[]): void;
    warn(...args: any[]): void;
    info(...args: any[]): void;
};

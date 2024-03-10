"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _Lawyers_prisma;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class Lawyers {
    constructor() {
        _Lawyers_prisma.set(this, void 0);
        __classPrivateFieldSet(this, _Lawyers_prisma, new client_1.PrismaClient(), "f");
    }
    getTopLawyers() { }
    getLawyersByCity() { }
    getLawyersBySpecialty() { }
    getLawyersByRating() { }
}
_Lawyers_prisma = new WeakMap();

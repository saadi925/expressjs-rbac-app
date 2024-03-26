"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
class Lawyers {
    #prisma;
    constructor() {
        this.#prisma = new client_1.PrismaClient();
    }
    getTopLawyers() { }
    getLawyersByCity() { }
    getLawyersBySpecialty() { }
    getLawyersByRating() { }
}

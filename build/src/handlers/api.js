"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseStatuses = void 0;
const client_1 = require("@prisma/client");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
function getCaseStatuses(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const isOk = (0, rbacMiddleware_1.checkForUser)(req, res);
            if (!isOk) {
                return;
            }
            // Get all the values of the CaseStatus enum
            const caseStatuses = Object.values(client_1.CaseStatus);
            res.status(200).json({ caseStatuses });
        }
        catch (error) {
            console.error(error);
            res.status(500).send({ error: 'Internal Server Error' });
        }
    });
}
exports.getCaseStatuses = getCaseStatuses;

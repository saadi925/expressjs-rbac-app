"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCaseStatuses = void 0;
const client_1 = require("@prisma/client");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
async function getCaseStatuses(req, res) {
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
}
exports.getCaseStatuses = getCaseStatuses;

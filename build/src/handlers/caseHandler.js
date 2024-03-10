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
exports.updateCaseStatus = exports.getCaseByID = exports.getCasesHandler = exports.deleteCaseHandler = exports.updateCaseHandler = exports.getAllOpenCases = exports.createCaseHandler = void 0;
const prisma_1 = require("../../prisma");
const validateCaseData_1 = require("../../src/middleware/validateCaseData");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prismaCase = new prisma_1.PrismaCase();
const notifier = new CaseNotifications_1.CaseNotifications();
//  this is the case creation handler , only 'CLIENT' can create the case,
const createCaseHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, status } = req.body;
    const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
    if (!ok) {
        return;
    }
    const error = (0, validateCaseData_1.validateCaseData)(req.body);
    if (error) {
        return res.status(403).json({ error: error.message });
    }
    const clientId = req.userId;
    const data = {
        title,
        description,
        status,
        clientId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lawyerId: null,
    };
    try {
        const createdCase = yield prismaCase.createCase(data);
        yield notifier.caseCreation(createdCase.title.slice(0, 32), {
            userId: req.userId,
        });
        res.status(201).json(Object.assign(Object.assign({}, createdCase), { id: createdCase.id.toString() }));
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.createCaseHandler = createCaseHandler;
function getAllOpenCases(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req;
            if (!userId) {
                return res.status(401).json({
                    error: 'Unauthorized',
                });
            }
            const cases = yield prismaCase.getAllOpenCases(userId);
            if (cases.length === 0) {
                return res.status(404).json({
                    error: 'No Open Cases Found',
                });
            }
            const serialized = cases.map((caseItem) => (Object.assign(Object.assign({}, caseItem), { id: String(caseItem.id) })));
            res.status(200).json(serialized);
        }
        catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
            console.log(error);
        }
    });
}
exports.getAllOpenCases = getAllOpenCases;
//  update Case ('CLIENT' req)
// 'id' in params
// 'case in body
const updateCaseHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
    if (!ok) {
        return;
    }
    const data = req.body;
    const { id } = req.params;
    const BigIntId = BigInt(id);
    try {
        const error = (0, validateCaseData_1.validateCaseData)(data);
        if (error) {
            return res.status(403).json({ error: error.message });
        }
        const exists = yield prismaCase.caseExists(BigIntId);
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        //  ready to be updated
        const newData = Object.assign(Object.assign({ id: BigIntId }, data), { clientId: req.userId, updatedAt: new Date(), createdAt: new Date() });
        const updatedCase = yield prismaCase.updateCase(newData, BigIntId);
        res.status(201).json(Object.assign(Object.assign({}, updatedCase), { id: updatedCase.id.toString() }));
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.updateCaseHandler = updateCaseHandler;
const deleteCaseHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
    if (!ok) {
        return;
    }
    try {
        const exists = yield prismaCase.caseExists(BigInt(id));
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        const deletedCase = yield prismaCase.deleteCase(BigInt(id), req.userId);
        res.status(201).json({
            message: `case has been deleted successfully with id ${deletedCase.id.toString()}`,
        });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.deleteCaseHandler = deleteCaseHandler;
const getCasesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const getAllCases = yield prismaCase.getCases(req.userId);
        const serialized = getAllCases.map((caseItem) => (Object.assign(Object.assign({}, caseItem), { id: String(caseItem.id) })));
        res.status(200).json(serialized);
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.getCasesHandler = getCasesHandler;
const getCaseByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const exists = yield prismaCase.caseExists(BigInt(id));
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        const caseByID = yield prismaCase.getCaseByID(BigInt(id));
        res.status(201).json({
            caseByID,
        });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.getCaseByID = getCaseByID;
//  body 'status'
// params 'id'
function updateCaseStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const { id } = req.params;
        const { status } = req.body;
        try {
            const exists = yield prismaCase.caseExists(BigInt(id));
            if (!exists) {
                return res.status(404).json({
                    error: 'Case Not Found',
                });
            }
            const updatedCase = yield prismaCase.updateCaseStatus(status, BigInt(id), req.userId);
            res.status(201).json(Object.assign(Object.assign({}, updatedCase), { id: updatedCase.id.toString() }));
        }
        catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
            console.log(error);
        }
    });
}
exports.updateCaseStatus = updateCaseStatus;

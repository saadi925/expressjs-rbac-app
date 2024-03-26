"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCaseStatus = exports.getCaseByID = exports.getCasesHandler = exports.deleteCaseHandler = exports.updateCaseHandler = exports.getAllOpenCases = exports.createCaseHandler = void 0;
const prisma_1 = require("../../prisma");
const validateCaseData_1 = require("../../src/middleware/validateCaseData");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prismaCase = new prisma_1.PrismaCase();
const notifier = new CaseNotifications_1.CaseNotifications();
//  this is the case creation handler , only 'CLIENT' can create the case,
const createCaseHandler = async (req, res) => {
    const { title, description, category } = req.body;
    const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
    if (!ok) {
        return;
    }
    const error = (0, validateCaseData_1.validateCaseData)(req.body);
    if (error) {
        return res.status(403).json({ error: error.message });
    }
    const status = 'OPEN';
    const clientId = req.userId;
    const data = {
        title,
        description,
        clientId,
        createdAt: new Date(),
        updatedAt: new Date(),
        lawyerId: null,
        category,
        status,
    };
    try {
        const createdCase = await prismaCase.createCase(data);
        await notifier.caseCreation(createdCase.title.slice(0, 32), {
            userId: req.userId,
        });
        res.status(201).json({ ...createdCase, id: createdCase.id.toString() });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.createCaseHandler = createCaseHandler;
async function getAllOpenCases(req, res) {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({
                error: 'Unauthorized',
            });
        }
        const cases = await prismaCase.getAllOpenCases(userId);
        if (cases.length === 0) {
            return res.status(404).json({
                error: 'No Open Cases Found',
            });
        }
        const serialized = cases.map((caseItem) => ({
            ...caseItem,
            id: String(caseItem.id),
        }));
        res.status(200).json(serialized);
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
}
exports.getAllOpenCases = getAllOpenCases;
//  update Case ('CLIENT' req)
// 'id' in params
// 'case in body
const updateCaseHandler = async (req, res) => {
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
        const exists = await prismaCase.caseExists(BigIntId);
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        //  ready to be updated
        const newData = {
            id: BigIntId,
            ...data,
            clientId: req.userId,
            updatedAt: new Date(),
            createdAt: new Date(),
        };
        const updatedCase = await prismaCase.updateCase(newData, BigIntId);
        res.status(201).json({ ...updatedCase, id: updatedCase.id.toString() });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.updateCaseHandler = updateCaseHandler;
const deleteCaseHandler = async (req, res) => {
    const { id } = req.params;
    const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
    if (!ok) {
        return;
    }
    try {
        const exists = await prismaCase.caseExists(BigInt(id));
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        const deletedCase = await prismaCase.deleteCase(BigInt(id), req.userId);
        res.status(201).json({
            message: `case has been deleted successfully with id ${deletedCase.id.toString()}`,
        });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.deleteCaseHandler = deleteCaseHandler;
const getCasesHandler = async (req, res) => {
    try {
        const getAllCases = await prismaCase.getCases(req.userId);
        const serialized = getAllCases.map((caseItem) => ({
            ...caseItem,
            id: String(caseItem.id),
        }));
        res.status(200).json(serialized);
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.getCasesHandler = getCasesHandler;
const getCaseByID = async (req, res) => {
    try {
        const { id } = req.params;
        const exists = await prismaCase.caseExists(BigInt(id));
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        const caseByID = await prismaCase.getCaseByID(BigInt(id));
        res.status(200).json({
            ...caseByID,
            id: String(caseByID?.id),
        });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.getCaseByID = getCaseByID;
//  body 'status'
// params 'id'
async function updateCaseStatus(req, res) {
    const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
    if (!ok) {
        return;
    }
    const { id } = req.params;
    const { status } = req.body;
    try {
        const exists = await prismaCase.caseExists(BigInt(id));
        if (!exists) {
            return res.status(404).json({
                error: 'Case Not Found',
            });
        }
        const updatedCase = await prismaCase.updateCaseStatus(status, BigInt(id), req.userId);
        res.status(201).json({ ...updatedCase, id: updatedCase.id.toString() });
    }
    catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
        console.log(error);
    }
}
exports.updateCaseStatus = updateCaseStatus;

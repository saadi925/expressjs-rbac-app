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
exports.acceptCaseRequestLawyerHandler = exports.createCaseRequestLawyerHandler = void 0;
const CaseRequests_1 = require("../../prisma/queries/CaseRequests");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prisma_1 = require("../../prisma");
const prismaCaseRequest = new CaseRequests_1.PrismaCaseRequest();
const notifier = new CaseNotifications_1.CaseNotifications();
const prismaCase = new prisma_1.PrismaCase();
function createCaseRequestLawyerHandler(req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req;
            let clientId;
            let lawyerId;
            const { caseId } = req.body;
            if (!caseId) {
                return res.status(400).json({ error: 'caseId is required' });
            }
            //  check if case exists
            const c = yield prismaCase.getCaseByID(caseId);
            if (!c) {
                res.status(403).json({ error: 'invalid request' });
                return;
            }
            clientId = c.clientId;
            lawyerId = userId;
            const bigintCaseId = BigInt(caseId);
            const caseRequest = yield prismaCaseRequest.createCaseRequest({
                clientId: clientId,
                lawyerId: lawyerId,
                caseId: bigintCaseId,
            });
            // add request to the sender sent request and reciever recieved requests
            // here sender is lawyer
            yield prismaCaseRequest.addToSenderSentRequests(caseRequest.id, lawyerId);
            yield prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, clientId);
            const notifyClientData = {
                userId: caseRequest.clientId,
                avatarUrl: ((_b = (_a = caseRequest.lawyer) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.avatar) || '',
                name: (_d = (_c = caseRequest.lawyer) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : 'Anonymous',
            };
            // Notifying
            // we notify client when lawyer sent a case request
            yield notifier.caseRequestNotifyClient(notifyClientData);
            res.status(201).json({ message: 'Case request sent ' });
        }
        catch (error) {
            console.error('Error creating case request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.createCaseRequestLawyerHandler = createCaseRequestLawyerHandler;
function acceptCaseRequestLawyerHandler(req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestId = BigInt(req.params.requestId);
            const caseRequest = yield prismaCaseRequest.getCaseRequestById(requestId);
            if (!caseRequest || caseRequest.status !== 'PENDING') {
                return res.status(404).send({
                    error: `case request is Not there anymore`,
                });
            }
            yield prismaCaseRequest.acceptCaseRequest(requestId);
            // Update lawyer's cases
            yield prismaCaseRequest.updateLawyerCases(req.userId, requestId);
            // Update client's cases if the user is a lawyer
            yield prismaCaseRequest.updateClientCases(caseRequest.clientId, requestId);
            // lawyer is reciever here
            // client is sender here
            yield prismaCaseRequest.removeRequestFromSenderSent(caseRequest.id, caseRequest.clientId);
            yield prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, caseRequest.lawyerId);
            const status = 'ASSIGNED';
            const updatedCase = yield prismaCase.addLawyerToCase(req.userId, caseRequest.clientId, caseRequest.caseId, status);
            const notifyLawyerData = {
                userId: caseRequest.lawyerId,
                avatarUrl: ((_b = (_a = caseRequest.client) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.avatar) || '',
                name: (_d = (_c = caseRequest.client) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : 'Anonymous',
            };
            const notifyClientData = {
                userId: caseRequest.clientId,
                avatarUrl: ((_f = (_e = caseRequest.lawyer) === null || _e === void 0 ? void 0 : _e.profile) === null || _f === void 0 ? void 0 : _f.avatar) || '',
                name: (_h = (_g = caseRequest.lawyer) === null || _g === void 0 ? void 0 : _g.name) !== null && _h !== void 0 ? _h : 'Anonymous',
            };
            yield notifier.caseAssignedNotifyLawyer(updatedCase.title, notifyLawyerData);
            yield notifier.caseAssignedNotifyClient(updatedCase.title, notifyClientData);
            res.status(204).json({
                message: `you have accepted the case request`,
            });
        }
        catch (error) {
            console.error('Error accepting case request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.acceptCaseRequestLawyerHandler = acceptCaseRequestLawyerHandler;

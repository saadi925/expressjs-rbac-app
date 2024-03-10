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
exports.cancelCaseRequestHandler = exports.getPendingCaseRequestsHandler = exports.rejectCaseRequestHandler = exports.acceptCaseRequestClientHandler = exports.createCaseRequestClientHandler = void 0;
const CaseRequests_1 = require("../../prisma/queries/CaseRequests");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prisma_1 = require("../../prisma");
const prismaCaseRequest = new CaseRequests_1.PrismaCaseRequest();
const notifier = new CaseNotifications_1.CaseNotifications();
const prismaCase = new prisma_1.PrismaCase();
function createCaseRequestClientHandler(req, res) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req;
            let clientId;
            let lawyerId;
            const { caseId, lawyerId: requestBodyLawyerId } = req.body;
            clientId = userId;
            lawyerId = requestBodyLawyerId;
            if (!caseId) {
                return res.status(400).json({ error: 'caseId is required' });
            }
            const bigintCaseId = BigInt(caseId);
            const caseRequest = yield prismaCaseRequest.createCaseRequest({
                clientId: clientId,
                lawyerId: lawyerId,
                caseId: bigintCaseId,
            });
            yield prismaCaseRequest.addToSenderSentRequests(caseRequest.id, clientId);
            yield prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, lawyerId);
            const notifyData = {
                userId: caseRequest.lawyerId,
                avatarUrl: ((_b = (_a = caseRequest.client) === null || _a === void 0 ? void 0 : _a.profile) === null || _b === void 0 ? void 0 : _b.avatar) || '',
                name: (_d = (_c = caseRequest.client) === null || _c === void 0 ? void 0 : _c.name) !== null && _d !== void 0 ? _d : 'Anonymous',
            };
            yield notifier.caseRequestNotifyLawyer(notifyData);
            res.status(201).json(caseRequest);
        }
        catch (error) {
            console.error('Error creating case request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.createCaseRequestClientHandler = createCaseRequestClientHandler;
function acceptCaseRequestClientHandler(req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userId = req.userId;
            if (!userId || typeof userId !== 'string') {
                res.status(401).send({
                    error: `Unauthorized`,
                });
                return;
            }
            const requestId = BigInt(req.params.requestId);
            const caseRequest = yield prismaCaseRequest.getCaseRequestById(requestId);
            if (!caseRequest || caseRequest.status !== 'PENDING') {
                res.status(404).send({
                    error: `case request is Not there anymore`,
                });
                return;
            }
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
            yield prismaCaseRequest.acceptCaseRequest(requestId);
            if (req.userRole == 'LAWYER') {
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
                yield notifier.caseAssignedNotifyLawyer(updatedCase.title, notifyLawyerData);
                yield notifier.caseAssignedNotifyClient(updatedCase.title, notifyLawyerData);
            }
            else {
                yield prismaCaseRequest.updateLawyerCases(caseRequest.lawyerId, requestId);
                yield prismaCaseRequest.updateClientCases(req.userId, requestId);
                // lawyer is sender here , client is reciever
                yield prismaCaseRequest.removeRequestFromSenderSent(caseRequest.id, caseRequest.lawyerId);
                yield prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, caseRequest.clientId);
                const status = 'ASSIGNED';
                const updatedCase = yield prismaCase.addLawyerToCase(caseRequest.lawyerId, req.userId, caseRequest.caseId, status);
                yield notifier.caseAssignedNotifyLawyer(updatedCase.title, notifyLawyerData);
                yield notifier.caseAssignedNotifyClient(updatedCase.title, notifyClientData);
            }
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
exports.acceptCaseRequestClientHandler = acceptCaseRequestClientHandler;
function rejectCaseRequestHandler(req, res) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestId = BigInt(req.params.requestId);
            const caseRequest = yield prismaCaseRequest.getCaseRequestById(requestId);
            if (!caseRequest || caseRequest.status !== 'PENDING') {
                return res.status(404).send({
                    error: `case request is not there anymore`,
                });
            }
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
            yield prismaCaseRequest.rejectCaseRequest(requestId);
            if (req.userRole == 'LAWYER') {
                //  here req is rejected by lawyer so we are notifying the client
                yield notifier.caseRequestRejectedNotify(notifyClientData);
            }
            else {
                yield notifier.caseRequestRejectedNotify(notifyLawyerData);
            }
            res.status(204).send(caseRequest);
        }
        catch (error) {
            console.error('Error rejecting case request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.rejectCaseRequestHandler = rejectCaseRequestHandler;
function getPendingCaseRequestsHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req; // userId is lawyer id here
            const pendingRequests = yield prismaCaseRequest.getPendingCaseRequestsByLawyer(userId);
            res.status(200).json(pendingRequests);
        }
        catch (error) {
            console.error('Error getting pending case requests:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.getPendingCaseRequestsHandler = getPendingCaseRequestsHandler;
function cancelCaseRequestHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const requestId = BigInt(req.params.requestId);
            const caseRequest = yield prismaCaseRequest.getCaseRequestById(requestId);
            // only the request sender can cancel the request.
            if (!caseRequest || caseRequest.status !== 'PENDING') {
                return res.status(404).send({
                    error: `case request is Not there anymore`,
                });
            }
            yield prismaCaseRequest.cancelCaseRequest(requestId);
            res.status(204).send();
        }
        catch (error) {
            console.error('Error cancelling case request:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.cancelCaseRequestHandler = cancelCaseRequestHandler;

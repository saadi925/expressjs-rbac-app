"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelCaseRequestHandler = exports.getPendingCaseRequestsHandler = exports.rejectCaseRequestHandler = exports.acceptCaseRequestClientHandler = exports.createCaseRequestClientHandler = void 0;
const CaseRequests_1 = require("../../prisma/queries/CaseRequests");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prisma_1 = require("../../prisma");
const prismaCaseRequest = new CaseRequests_1.PrismaCaseRequest();
const notifier = new CaseNotifications_1.CaseNotifications();
const prismaCase = new prisma_1.PrismaCase();
async function createCaseRequestClientHandler(req, res) {
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
        const caseRequest = await prismaCaseRequest.createCaseRequest({
            clientId: clientId,
            lawyerId: lawyerId,
            caseId: bigintCaseId,
        });
        await prismaCaseRequest.addToSenderSentRequests(caseRequest.id, clientId);
        await prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, lawyerId);
        const notifyData = {
            userId: caseRequest.lawyerId,
            avatarUrl: caseRequest.client?.profile?.avatar || '',
            name: caseRequest.client?.name ?? 'Anonymous',
        };
        await notifier.caseRequestNotifyLawyer(notifyData);
        res.status(201).json(caseRequest);
    }
    catch (error) {
        console.error('Error creating case request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.createCaseRequestClientHandler = createCaseRequestClientHandler;
async function acceptCaseRequestClientHandler(req, res) {
    try {
        const userId = req.userId;
        if (!userId || typeof userId !== 'string') {
            res.status(401).send({
                error: `Unauthorized`,
            });
            return;
        }
        const requestId = BigInt(req.params.requestId);
        const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
        if (!caseRequest || caseRequest.status !== 'PENDING') {
            res.status(404).send({
                error: `case request is Not there anymore`,
            });
            return;
        }
        const notifyLawyerData = {
            userId: caseRequest.lawyerId,
            avatarUrl: caseRequest.client?.profile?.avatar || '',
            name: caseRequest.client?.name ?? 'Anonymous',
        };
        const notifyClientData = {
            userId: caseRequest.clientId,
            avatarUrl: caseRequest.lawyer?.profile?.avatar || '',
            name: caseRequest.lawyer?.name ?? 'Anonymous',
        };
        await prismaCaseRequest.acceptCaseRequest(requestId);
        if (req.userRole == 'LAWYER') {
            // Update lawyer's cases
            await prismaCaseRequest.updateLawyerCases(req.userId, requestId);
            // Update client's cases if the user is a lawyer
            await prismaCaseRequest.updateClientCases(caseRequest.clientId, requestId);
            // lawyer is reciever here
            // client is sender here
            await prismaCaseRequest.removeRequestFromSenderSent(caseRequest.id, caseRequest.clientId);
            await prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, caseRequest.lawyerId);
            const status = 'ASSIGNED';
            const updatedCase = await prismaCase.addLawyerToCase(req.userId, caseRequest.clientId, caseRequest.caseId, status);
            await notifier.caseAssignedNotifyLawyer(updatedCase.title, notifyLawyerData);
            await notifier.caseAssignedNotifyClient(updatedCase.title, notifyLawyerData);
        }
        else {
            await prismaCaseRequest.updateLawyerCases(caseRequest.lawyerId, requestId);
            await prismaCaseRequest.updateClientCases(req.userId, requestId);
            // lawyer is sender here , client is reciever
            await prismaCaseRequest.removeRequestFromSenderSent(caseRequest.id, caseRequest.lawyerId);
            await prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, caseRequest.clientId);
            const status = 'ASSIGNED';
            const updatedCase = await prismaCase.addLawyerToCase(caseRequest.lawyerId, req.userId, caseRequest.caseId, status);
            await notifier.caseAssignedNotifyLawyer(updatedCase.title, notifyLawyerData);
            await notifier.caseAssignedNotifyClient(updatedCase.title, notifyClientData);
        }
        res.status(204).json({
            message: `you have accepted the case request`,
        });
    }
    catch (error) {
        console.error('Error accepting case request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.acceptCaseRequestClientHandler = acceptCaseRequestClientHandler;
async function rejectCaseRequestHandler(req, res) {
    try {
        const requestId = BigInt(req.params.requestId);
        const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
        if (!caseRequest || caseRequest.status !== 'PENDING') {
            return res.status(404).send({
                error: `case request is not there anymore`,
            });
        }
        const notifyLawyerData = {
            userId: caseRequest.lawyerId,
            avatarUrl: caseRequest.client?.profile?.avatar || '',
            name: caseRequest.client?.name ?? 'Anonymous',
        };
        const notifyClientData = {
            userId: caseRequest.clientId,
            avatarUrl: caseRequest.lawyer?.profile?.avatar || '',
            name: caseRequest.lawyer?.name ?? 'Anonymous',
        };
        await prismaCaseRequest.rejectCaseRequest(requestId);
        if (req.userRole == 'LAWYER') {
            //  here req is rejected by lawyer so we are notifying the client
            await notifier.caseRequestRejectedNotify(notifyClientData);
        }
        else {
            await notifier.caseRequestRejectedNotify(notifyLawyerData);
        }
        res.status(204).send(caseRequest);
    }
    catch (error) {
        console.error('Error rejecting case request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.rejectCaseRequestHandler = rejectCaseRequestHandler;
async function getPendingCaseRequestsHandler(req, res) {
    try {
        const { userId } = req; // userId is lawyer id here
        const { userRole } = req;
        let pendingRequests;
        if (userRole === 'LAWYER') {
            pendingRequests = await prismaCaseRequest.getPendingCaseRequestsByLawyer(userId);
        }
        else {
            pendingRequests = await prismaCaseRequest.getPendingCaseRequestsByClient(userId);
        }
        res.status(200).json(pendingRequests);
    }
    catch (error) {
        console.error('Error getting pending case requests:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getPendingCaseRequestsHandler = getPendingCaseRequestsHandler;
async function cancelCaseRequestHandler(req, res) {
    try {
        const requestId = BigInt(req.params.requestId);
        const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
        // only the request sender can cancel the request.
        if (!caseRequest || caseRequest.status !== 'PENDING') {
            return res.status(404).send({
                error: `case request is Not there anymore`,
            });
        }
        await prismaCaseRequest.cancelCaseRequest(requestId);
        res.status(204).send();
    }
    catch (error) {
        console.error('Error cancelling case request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.cancelCaseRequestHandler = cancelCaseRequestHandler;

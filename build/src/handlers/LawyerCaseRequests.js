"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.acceptCaseRequestLawyerHandler = exports.createCaseRequestLawyerHandler = void 0;
const CaseRequests_1 = require("../../prisma/queries/CaseRequests");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prisma_1 = require("../../prisma");
const prismaCaseRequest = new CaseRequests_1.PrismaCaseRequest();
const notifier = new CaseNotifications_1.CaseNotifications();
const prismaCase = new prisma_1.PrismaCase();
async function createCaseRequestLawyerHandler(req, res) {
    try {
        const { userId } = req;
        let clientId;
        let lawyerId;
        const { caseId } = req.body;
        if (!caseId) {
            return res.status(400).json({ error: 'caseId is required' });
        }
        //  check if case exists
        const c = await prismaCase.getCaseByID(caseId);
        if (!c) {
            res.status(403).json({ error: 'invalid request' });
            return;
        }
        clientId = c.clientId;
        lawyerId = userId;
        const bigintCaseId = BigInt(caseId);
        const caseRequest = await prismaCaseRequest.createCaseRequest({
            clientId: clientId,
            lawyerId: lawyerId,
            caseId: bigintCaseId,
        });
        // add request to the sender sent request and reciever recieved requests
        // here sender is lawyer
        await prismaCaseRequest.addToSenderSentRequests(caseRequest.id, lawyerId);
        await prismaCaseRequest.addToRecieverRecieveRequests(caseRequest.id, clientId);
        const notifyClientData = {
            userId: caseRequest.clientId,
            avatarUrl: caseRequest.lawyer?.profile?.avatar || '',
            name: caseRequest.lawyer?.name ?? 'Anonymous',
        };
        // Notifying
        // we notify client when lawyer sent a case request
        await notifier.caseRequestNotifyClient(notifyClientData);
        res.status(201).json({ message: 'Case request sent ' });
    }
    catch (error) {
        console.error('Error creating case request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.createCaseRequestLawyerHandler = createCaseRequestLawyerHandler;
async function acceptCaseRequestLawyerHandler(req, res) {
    try {
        const requestId = BigInt(req.params.requestId);
        const caseRequest = await prismaCaseRequest.getCaseRequestById(requestId);
        if (!caseRequest || caseRequest.status !== 'PENDING') {
            return res.status(404).send({
                error: `case request is Not there anymore`,
            });
        }
        await prismaCaseRequest.acceptCaseRequest(requestId);
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
        await notifier.caseAssignedNotifyLawyer(updatedCase.title, notifyLawyerData);
        await notifier.caseAssignedNotifyClient(updatedCase.title, notifyClientData);
        res.status(204).json({
            message: `you have accepted the case request`,
        });
    }
    catch (error) {
        console.error('Error accepting case request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.acceptCaseRequestLawyerHandler = acceptCaseRequestLawyerHandler;

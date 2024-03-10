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
exports.assignCaseToLawyer = void 0;
const cases_1 = require("../../prisma/queries/cases");
const CaseNotifications_1 = require("../../notifications/CaseNotifications");
const prismaCase = new cases_1.PrismaCase();
// LAWYER caseId, clientId, status
// CLIENT caseId, lawyerId, status
const assignCaseToLawyer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
        const { userRole } = req;
        const notifier = new CaseNotifications_1.CaseNotifications();
        let caseId, clientId, lawyerId, status;
        if (userRole === 'LAWYER') {
            ({ caseId, clientId, status } = req.body);
        }
        else {
            ({ caseId, lawyerId, status } = req.body);
        }
        if (!caseId ||
            (userRole === 'LAWYER' && !clientId) ||
            (userRole !== 'LAWYER' && !lawyerId)) {
            return res.status(400).json({
                error: userRole === 'LAWYER'
                    ? 'Both case and client must be provided'
                    : 'Both case and lawyer must be provided',
            });
        }
        const updatedCase = yield prismaCase.addLawyerToCase(userRole === 'LAWYER' ? req.userId : lawyerId, userRole !== 'LAWYER' ? req.userId : clientId, caseId, status);
        let message;
        const lawyerData = {
            name: (_a = updatedCase.client.name) !== null && _a !== void 0 ? _a : 'Anonymous',
            userId: lawyerId,
            avatarUrl: ((_c = (_b = updatedCase.lawyer) === null || _b === void 0 ? void 0 : _b.profile) === null || _c === void 0 ? void 0 : _c.avatar) || '',
        };
        const clientData = {
            name: (_e = (_d = updatedCase.lawyer) === null || _d === void 0 ? void 0 : _d.name) !== null && _e !== void 0 ? _e : 'Anonymous',
            userId: clientId,
            avatarUrl: ((_g = (_f = updatedCase.client) === null || _f === void 0 ? void 0 : _f.profile) === null || _g === void 0 ? void 0 : _g.avatar) || '',
        };
        // notify lawyer that case has been assigned to him
        const lawyerNotification = yield notifier.caseAssignedNotifyLawyer(updatedCase.title, lawyerData);
        // notify client that case has been assigned to lawyer
        const clientNotification = yield notifier.caseAssignedNotifyClient(updatedCase.title, clientData);
        if (userRole == 'LAWYER') {
            message = lawyerNotification;
        }
        else {
            message = clientNotification;
        }
        res.status(200).json({
            message,
            case: updatedCase,
        });
    }
    catch (error) {
        console.error('Error assigning case to lawyer:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.assignCaseToLawyer = assignCaseToLawyer;

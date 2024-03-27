"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commonRoutes = void 0;
const express_1 = __importDefault(require("express"));
const api_1 = require("../../src/handlers/api");
const authMiddleware_1 = require("../../src/middleware/authMiddleware");
const clientCaseRequest_1 = require("../../src/handlers/clientCaseRequest");
const attachments_1 = require("../../src/utils/attachments");
const attachmentsHandler_1 = require("../../src/handlers/attachmentsHandler");
const messagesHandler_1 = require("../../src/handlers/messagesHandler");
const router = express_1.default.Router();
exports.commonRoutes = router;
//  get the statuses available for case
router.get('/case_statuses', authMiddleware_1.authMiddleware, api_1.getCaseStatuses);
// CaseRequests Routes
router.get('/case_request/pending', authMiddleware_1.authMiddleware, clientCaseRequest_1.getPendingCaseRequestsHandler);
router.put('/case_request/reject/:requestId', authMiddleware_1.authMiddleware, clientCaseRequest_1.rejectCaseRequestHandler);
router.put('/case_request/cancel/:requestId', authMiddleware_1.authMiddleware, clientCaseRequest_1.cancelCaseRequestHandler);
router.post('/case/:caseId/attachments', authMiddleware_1.authMiddleware, attachments_1.upload.single('file'), attachmentsHandler_1.uploadingCaseAttachments);
// GET endpoint for downloading case attachments
router.get('/case/:caseId/attachments/:filename', authMiddleware_1.authMiddleware, attachmentsHandler_1.downloadingCaseAttachments);
router.get('/messages', authMiddleware_1.authMiddleware, messagesHandler_1.getMessages);

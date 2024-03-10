"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const caseHandler_1 = require("../handlers/caseHandler");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const authMiddleware_1 = require("../middleware/authMiddleware");
const clientCaseRequest_1 = require("../../src/handlers/clientCaseRequest");
const attachmentsHandler_1 = require("../../src/handlers/attachmentsHandler");
const Reviews_1 = require("../../src/handlers/Reviews");
const lawyers_1 = require("../../src/handlers/lawyers");
const router = express_1.default.Router();
exports.clientRoutes = router;
// get a case by id
router.get('/case/:id', authMiddleware_1.authMiddleware, caseHandler_1.getCaseByID);
router.put('/update-case-status/:id', authMiddleware_1.authMiddleware, caseHandler_1.updateCaseStatus);
// create a case
router.post('/case', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, caseHandler_1.createCaseHandler);
// update a case
router.put('/case/:id', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, caseHandler_1.updateCaseHandler);
// delete a case
router.delete('/case/:id', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, caseHandler_1.deleteCaseHandler);
// get all cases 'CLIENT' only
router.get('/cases', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, caseHandler_1.getCasesHandler);
router.get('/cases/open', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, caseHandler_1.getAllOpenCases);
// lawyer id , case id
router.post('/case_request', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, clientCaseRequest_1.createCaseRequestClientHandler);
router.put('/case_request/accept/:requestId', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, clientCaseRequest_1.acceptCaseRequestClientHandler);
router.post('/attachments', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.get('/attachments/:attachmentId', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.put('/attachments/:attachmentId', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.delete('/attachments/:attachmentId', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.get('/lawyers', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, lawyers_1.GetLawyers);
router.post('/review', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, Reviews_1.createReview);
router.put('/review', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, Reviews_1.updateReview);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRoutes = void 0;
const express_1 = __importDefault(require("express"));
const caseHandler_1 = require("../handlers/caseHandler");
const middleware_1 = require("../middleware");
const clientCaseRequest_1 = require("../../src/handlers/clientCaseRequest");
const attachmentsHandler_1 = require("../../src/handlers/attachmentsHandler");
const Reviews_1 = require("../../src/handlers/Reviews");
const lawyers_1 = require("../../src/handlers/lawyers");
'/client';
const router = express_1.default.Router();
exports.clientRoutes = router;
// get a case by id
router.get('/case/:id', middleware_1.authMiddleware, caseHandler_1.getCaseByID);
router.put('/update-case-status/:id', middleware_1.authMiddleware, caseHandler_1.updateCaseStatus);
// create a case
router.post('/case', middleware_1.authMiddleware, middleware_1.RBACMiddleware, caseHandler_1.createCaseHandler);
// update a case
router.put('/case/:id', middleware_1.authMiddleware, middleware_1.RBACMiddleware, caseHandler_1.updateCaseHandler);
// delete a case
router.delete('/case/:id', middleware_1.authMiddleware, middleware_1.RBACMiddleware, caseHandler_1.deleteCaseHandler);
// get all cases 'CLIENT' only
router.get('/cases', middleware_1.authMiddleware, middleware_1.RBACMiddleware, caseHandler_1.getCasesHandler);
router.get('/cases/open', middleware_1.authMiddleware, middleware_1.RBACMiddleware, caseHandler_1.getAllOpenCases);
router.get('/lawyers', middleware_1.authMiddleware, middleware_1.RBACMiddleware, lawyers_1.GetLawyers);
router.post('/review', middleware_1.authMiddleware, middleware_1.RBACMiddleware, Reviews_1.createReview);
router.put('/review', middleware_1.authMiddleware, middleware_1.RBACMiddleware, Reviews_1.updateReview);
// lawyer id , case id
router.post('/case_request', middleware_1.authMiddleware, middleware_1.RBACMiddleware, clientCaseRequest_1.createCaseRequestClientHandler);
router.put('/case_request/accept/:requestId', middleware_1.authMiddleware, middleware_1.RBACMiddleware, clientCaseRequest_1.acceptCaseRequestClientHandler);
router.get('/case_request/pending', middleware_1.authMiddleware, middleware_1.RBACMiddleware, clientCaseRequest_1.getPendingCaseRequestsHandler);
router.post('/attachments', middleware_1.authMiddleware, middleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.get('/attachments/:attachmentId', middleware_1.authMiddleware, middleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.put('/attachments/:attachmentId', middleware_1.authMiddleware, middleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);
router.delete('/attachments/:attachmentId', middleware_1.authMiddleware, middleware_1.RBACMiddleware, attachmentsHandler_1.uploadingCaseAttachments);

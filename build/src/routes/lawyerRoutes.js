"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lawyerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const LawyerCaseRequests_1 = require("../../src/handlers/LawyerCaseRequests");
const LawyerProfileHandler_1 = require("../../src/handlers/LawyerProfileHandler");
const LawyerContact_1 = require("../../src/handlers/LawyerContact");
const caseHandler_1 = require("../../src/handlers/caseHandler");
const lawyers_1 = require("../../src/handlers/lawyers");
// lawyerRoutes
//  '/lawyer '
const r = express_1.default.Router();
exports.lawyerRoutes = r;
// GET ALL PENDING CASE REQUESTS
//  LAWYER --> body 'case_id', 'client_id'
r.post('/case_request', middleware_1.authMiddleware, middleware_1.RBACMiddleware, LawyerCaseRequests_1.createCaseRequestLawyerHandler);
r.get('/case_request/pending', middleware_1.authMiddleware, middleware_1.RBACMiddleware, LawyerCaseRequests_1.createCaseRequestLawyerHandler);
r.put('/case_request/accept/:requestId', middleware_1.authMiddleware, middleware_1.RBACMiddleware, LawyerCaseRequests_1.acceptCaseRequestLawyerHandler);
r.post('/profile', middleware_1.authMiddleware, middleware_1.RBACMiddleware, middleware_1.createLawyerProfileValidationRules, LawyerProfileHandler_1.createOrUpdateLawyerProfile);
r.get('/profile', middleware_1.authMiddleware, middleware_1.RBACMiddleware, LawyerProfileHandler_1.getLawyerProfile);
r.post('/profile/contact', middleware_1.authMiddleware, middleware_1.RBACMiddleware, middleware_1.validateContact, LawyerContact_1.createLawyerContact);
r.put('/profile/contact', middleware_1.authMiddleware, middleware_1.RBACMiddleware, middleware_1.validateContact, LawyerContact_1.updateLawyerContact);
r.get('/cases', middleware_1.authMiddleware, middleware_1.RBACMiddleware, caseHandler_1.getCasesHandlerForLawyer);
r.get('/clients', middleware_1.authMiddleware, middleware_1.RBACMiddleware, lawyers_1.GetClients);

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lawyerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const LawyerCaseRequests_1 = require("../../src/handlers/LawyerCaseRequests");
const LawyerProfileHandler_1 = require("../../src/handlers/LawyerProfileHandler");
const LawyerContact_1 = require("../../src/handlers/LawyerContact");
const validator_1 = require("../../src/middleware/validator");
const r = express_1.default.Router();
exports.lawyerRoutes = r;
// GET ALL PENDING CASE REQUESTS
//  LAWYER --> body 'case_id', 'client_id'
r.post('/case_request', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, LawyerCaseRequests_1.createCaseRequestLawyerHandler);
r.put('/case_request/accept/:requestId', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, LawyerCaseRequests_1.acceptCaseRequestLawyerHandler);
r.post('/profile', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, LawyerProfileHandler_1.createOrUpdateLawyerProfile);
r.get('/profile', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, LawyerProfileHandler_1.getLawyerProfile);
r.post('/profile/contact', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, validator_1.validateContact, LawyerContact_1.createLawyerContact);
r.put('/profile/contact', authMiddleware_1.authMiddleware, rbacMiddleware_1.RBACMiddleware, validator_1.validateContact, LawyerContact_1.updateLawyerContact);

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
exports.checkForUser = exports.RBACMiddleware = void 0;
const casbin_1 = require("casbin");
const keys_1 = require("../../config/keys");
const RBACMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const enforcer = yield (0, casbin_1.newEnforcer)(keys_1.rbacConfig.model, keys_1.rbacConfig.policy);
    const { userRole } = req;
    const path = req.originalUrl;
    const method = req.method;
    if (!(yield enforcer.enforce(userRole, path, method))) {
        return res.status(403).send('Forbidden');
    }
    next();
});
exports.RBACMiddleware = RBACMiddleware;
//  if request has an id , it will return true otherwise it will return error
function checkForUser(req, res) {
    const { userId } = req;
    if (!userId || typeof userId !== 'string') {
        res.status(401).json({ error: 'Unauthorized' });
        return false;
    }
    return true;
}
exports.checkForUser = checkForUser;

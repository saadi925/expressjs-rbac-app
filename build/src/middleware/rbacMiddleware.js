"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForUser = exports.RBACMiddleware = void 0;
const casbin_1 = require("casbin");
const keys_1 = require("../../config/keys");
const RBACMiddleware = async (req, res, next) => {
    const enforcer = await (0, casbin_1.newEnforcer)(keys_1.rbacConfig.model, keys_1.rbacConfig.policy);
    const { userRole } = req;
    const path = req.originalUrl;
    const method = req.method;
    if (!(await enforcer.enforce(userRole, path, method))) {
        return res.status(403).send('Forbidden');
    }
    next();
};
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

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespondWithJson = exports.RespondWithError = void 0;
function RespondWithError(res, code, errors) {
    return res.status(code).json({
        errors: [errors],
    });
}
exports.RespondWithError = RespondWithError;
function RespondWithJson(res, code, data) {
    res.status(code).json({
        data,
    });
}
exports.RespondWithJson = RespondWithJson;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCaseData = void 0;
const isTitleValid = (title) => {
    if (typeof title !== 'string' || title == undefined)
        return false;
    const regex = /^[a-zA-Z0-9 .,\'-]{5,50}$/;
    return regex.test(title);
};
const isDescriptionValid = (description) => {
    if (typeof description !== 'string' || description == undefined)
        return false;
    const regex = /^[a-zA-Z0-9 .,\'-]{5,500}$/;
    return regex.test(description);
};
const isStatusValid = (status) => {
    if (typeof status !== 'string' || status == undefined)
        return false;
    const regex = /^(OPEN|REVIEW|IN_PROGRESS|ON_HOLD|RESOLVED|DISMISSED|CLOSED|PENDING)$/;
    return regex.test(status);
};
const validateCaseData = (data) => {
    const { status, description, title } = data;
    if (!isTitleValid(title)) {
        return Error('Invalid title');
    }
    if (!isDescriptionValid(description)) {
        return Error('Invalid description');
    }
    if (!isStatusValid(status)) {
        return Error('Invalid Status');
    }
};
exports.validateCaseData = validateCaseData;

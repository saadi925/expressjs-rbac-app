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
exports.deleteLawyerContact = exports.updateLawyerContact = exports.getLawyerContactById = exports.createLawyerContact = void 0;
const express_validator_1 = require("express-validator");
const LawyerContact_1 = require("../../prisma/queries/LawyerContact");
const lawyerContact = new LawyerContact_1.LawyerContact();
const createLawyerContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    const { email, phone, phoneNumber, facebook, officeAddress, instagram, linkedin, } = req.body;
    try {
        const data = {
            email,
            phone,
            phoneNumber,
            facebook,
            officeAddress,
            instagram,
            linkedin,
            lawyerId: userId,
        };
        const profile = yield lawyerContact.createLawyerContact(data);
        res.status(201).json({ profile });
    }
    catch (error) {
        console.error('Error creating lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.createLawyerContact = createLawyerContact;
const getLawyerContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const profile = yield lawyerContact.getLawyerContactById(id);
        if (!profile) {
            return res.status(404).json({ error: 'Lawyer contact not found' });
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error fetching lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.getLawyerContactById = getLawyerContactById;
const updateLawyerContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    const { email, phone, phoneNumber, facebook, officeAddress, instagram, linkedin, } = req.body;
    try {
        const data = {
            email,
            phone,
            phoneNumber,
            facebook,
            officeAddress,
            instagram,
            linkedin,
        };
        const profile = yield lawyerContact.updateLawyerContact(userId, data);
        if (!profile) {
            return res.status(404).json({ error: 'Lawyer contact not found' });
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error updating lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.updateLawyerContact = updateLawyerContact;
const deleteLawyerContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const profile = yield lawyerContact.deleteLawyerContact(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Lawyer contact not found' });
        }
        res.status(200).json({ message: 'Lawyer contact deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.deleteLawyerContact = deleteLawyerContact;

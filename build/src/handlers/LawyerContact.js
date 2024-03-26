"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLawyerContact = exports.updateLawyerContact = exports.getLawyerContactById = exports.createLawyerContact = void 0;
const express_validator_1 = require("express-validator");
const LawyerContact_1 = require("../../prisma/queries/LawyerContact");
const lawyerContact = new LawyerContact_1.PrismaLawyerContact();
const createLawyerContact = async (req, res) => {
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
        const profile = await lawyerContact.createLawyerContact(data);
        res.status(201).json({ profile });
    }
    catch (error) {
        console.error('Error creating lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.createLawyerContact = createLawyerContact;
const getLawyerContactById = async (req, res) => {
    const { id } = req.params;
    try {
        const profile = await lawyerContact.getLawyerContactById(id);
        if (!profile) {
            return res.status(404).json({ error: 'Lawyer contact not found' });
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error fetching lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.getLawyerContactById = getLawyerContactById;
const updateLawyerContact = async (req, res) => {
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
        const profile = await lawyerContact.updateLawyerContact(userId, data);
        if (!profile) {
            return res.status(404).json({ error: 'Lawyer contact not found' });
        }
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error updating lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.updateLawyerContact = updateLawyerContact;
const deleteLawyerContact = async (req, res) => {
    const userId = req.userId;
    try {
        const profile = await lawyerContact.deleteLawyerContact(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Lawyer contact not found' });
        }
        res.status(200).json({ message: 'Lawyer contact deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting lawyer contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
exports.deleteLawyerContact = deleteLawyerContact;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLawyerProfile = exports.createOrUpdateLawyerProfile = void 0;
const express_validator_1 = require("express-validator");
const LawyerProfile_1 = require("../../prisma/queries/LawyerProfile");
const LawyerContact_1 = require("../../prisma/queries/LawyerContact");
const lawyerProfile = new LawyerProfile_1.PrismaLawyerProfile();
const createOrUpdateLawyerProfile = async (req, res) => {
    // Validate request body using Express Validator
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    try {
        const { experience, education, specialization, status, description, email, website, instagram, phone, linkedin, officeAddress, facebook, } = req.body;
        const data = {
            experience,
            description,
            education,
            specialization,
            status,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        console.log(email);
        const profile = await lawyerProfile.createOrUpdateLawyerProfile(data);
        const lawyerContact = new LawyerContact_1.PrismaLawyerContact();
        const contact = {
            lawyerId: profile.id,
            email,
            website,
            instagram,
            phone,
            officeAddress,
            facebook,
            linkedin,
        };
        await lawyerContact.createLawyerContact(contact, userId);
        res.status(201).json({ profile });
    }
    catch (error) {
        console.error('Error creating lawyer profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.createOrUpdateLawyerProfile = createOrUpdateLawyerProfile;
const getLawyerProfile = async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({ error: 'unauthorized' });
    }
    try {
        try {
            const profile = await lawyerProfile.getLawyerProfileById(userId);
            res.status(200).json({ profile });
        }
        catch (error) {
            console.error('Error fetching lawyer profile:', error);
            res.status(400).json({ error: error.message });
        }
    }
    catch (error) {
        console.error('Error fetching lawyer profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getLawyerProfile = getLawyerProfile;

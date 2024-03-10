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
exports.getLawyerProfile = exports.createOrUpdateLawyerProfile = void 0;
const express_validator_1 = require("express-validator");
const LawyerProfile_1 = require("../../prisma/queries/LawyerProfile");
const lawyerProfile = new LawyerProfile_1.PrismaLawyerProfile();
const createOrUpdateLawyerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body using Express Validator
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const userId = req.userId;
    try {
        const { bio, experience, education, specialization, status, description } = req.body;
        const data = {
            bio,
            experience,
            description,
            education,
            specialization,
            status,
            userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const profile = yield lawyerProfile.createOrUpdateLawyerProfile(data);
        res.status(201).json({ profile });
    }
    catch (error) {
        console.error('Error creating lawyer profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.createOrUpdateLawyerProfile = createOrUpdateLawyerProfile;
const getLawyerProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const profile = yield lawyerProfile.getLawyerProfileById(userId);
        res.status(200).json({ profile });
    }
    catch (error) {
        console.error('Error fetching lawyer profile:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.getLawyerProfile = getLawyerProfile;

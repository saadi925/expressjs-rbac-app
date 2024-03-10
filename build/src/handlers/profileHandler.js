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
exports.deleteUserProfile = exports.getUserProfile = exports.updateProfileHandler = exports.createProfile = void 0;
const validateProfile_1 = require("../middleware/validateProfile");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const profile_1 = require("../../prisma/queries/profile");
const primsaProfile = new profile_1.PrismaDBProfile();
// creates a profile for a user
//  req.body: { location, bio, avatar, displayname,phone }
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, bio, avatar, displayname, phone } = req.body;
        const { userId } = req;
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const error = (0, validateProfile_1.validateProfileCredentials)(req.body);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const data = {
            location,
            bio,
            avatar,
            displayname,
            phone,
        };
        const profile = yield primsaProfile.createProfile(data, userId);
        res.status(201).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.createProfile = createProfile;
// updates a profile for an authenticated user
//  req.body: { location, bio, avatar, displayname,phone }
const updateProfileHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, bio, avatar, displayname, phone } = req.body;
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const error = (0, validateProfile_1.validateProfileCredentials)(req.body);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const data = {
            location,
            bio,
            avatar,
            displayname,
            phone,
        };
        const profile = yield primsaProfile.updateProfile(req.userId, data);
        res.status(201).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.updateProfileHandler = updateProfileHandler;
const getUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const profile = yield primsaProfile.getProfileWithRole(userId);
        res.status(200).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.getUserProfile = getUserProfile;
const deleteUserProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req;
        const deletedProfile = yield primsaProfile.deleteProfile(userId);
        res.status(200).json({
            message: `the profile has been deleted successfully with the user id ${deletedProfile.id.toString()}`,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
});
exports.deleteUserProfile = deleteUserProfile;

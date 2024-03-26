"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserProfile = exports.getUserProfile = exports.updateProfileHandler = exports.createProfile = void 0;
const validateProfile_1 = require("../middleware/validateProfile");
const rbacMiddleware_1 = require("../middleware/rbacMiddleware");
const profile_1 = require("../../prisma/queries/profile");
const primsaProfile = new profile_1.PrismaDBProfile();
// creates a profile for a user
//  req.body: { location, bio, avatar, displayname,phone }
const createProfile = async (req, res) => {
    try {
        const { location, bio, displayname, phone } = req.body;
        const { userId } = req;
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const avatar = 'https://images.unsplash.com/photo-1599566147214-ce487862ea4f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D';
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
        // [{"fileName": "20240308_133040.jpg", "fileSize": 2941227, "height": 3054, "originalPath": "/storage/emulated/0/DCIM/Camera/20240308_133040.jpg", "type": "image/jpeg", "uri": "file:///data/user/0/com.awesomeproject/cache/rn_image_picker_lib_temp_33481401-6fc4-4860-9948-3b95ab7bf390.jpg", "width": 2290}]
        const profile = await primsaProfile.createProfile(data, userId);
        res.status(201).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.createProfile = createProfile;
// updates a profile for an authenticated user
//  req.body: { location, bio, avatar, displayname,phone }
const updateProfileHandler = async (req, res) => {
    try {
        const { location, bio, displayname, phone } = req.body;
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const error = (0, validateProfile_1.validateProfileCredentials)(req.body);
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        const avatar = 'https://images.unsplash.com/photo-1599566147214-ce487862ea4f?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGF2YXRhcnN8ZW58MHx8MHx8fDA%3D';
        const data = {
            location,
            bio,
            avatar,
            displayname,
            phone,
        };
        const profile = await primsaProfile.updateProfile(req.userId, data);
        res.status(201).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.updateProfileHandler = updateProfileHandler;
const getUserProfile = async (req, res) => {
    try {
        const { userId } = req;
        const ok = (0, rbacMiddleware_1.checkForUser)(req, res);
        if (!ok) {
            return;
        }
        const profile = await primsaProfile.getProfileWithRole(userId);
        res.status(200).json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.getUserProfile = getUserProfile;
const deleteUserProfile = async (req, res) => {
    try {
        const { userId } = req;
        const deletedProfile = await primsaProfile.deleteProfile(userId);
        res.status(200).json({
            message: `the profile has been deleted successfully with the user id ${deletedProfile.id.toString()}`,
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
        console.log(error);
    }
};
exports.deleteUserProfile = deleteUserProfile;

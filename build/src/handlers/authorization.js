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
exports.authorizeAction = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const SCREENS = {
    LOGIN: 'Login',
    CREATE_PROFILE: 'Create Profile',
    CONTACT: 'Contact',
    LAWYER_PROFILE: 'Lawyer Profile',
    APP: 'App',
};
const authorizeAction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const isLawyer = req.userRole === 'LAWYER';
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true, lawyerProfile: isLawyer ? true : false },
        });
        if (!user) {
            return res
                .status(403)
                .json({ message: 'Unauthorized', redirect: SCREENS.LOGIN });
        }
        if (!user.profile) {
            return res
                .status(403)
                .json({ message: 'Unauthorized', redirect: SCREENS.CREATE_PROFILE });
        }
        if (!user.profile.contact) {
            return res
                .status(403)
                .json({ message: 'Unauthorized', redirect: SCREENS.CONTACT });
        }
        if (user.role === 'LAWYER') {
            if (!user.lawyerProfile) {
                return res
                    .status(403)
                    .json({ message: 'Unauthorized', redirect: SCREENS.LAWYER_PROFILE });
            }
        }
        return res.status(200).json({
            message: 'Authorized',
            redirect: SCREENS.APP,
            user: {
                avatar: user.profile.avatar,
                displayname: user.profile.displayname,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error('Error authorizing action:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
exports.authorizeAction = authorizeAction;

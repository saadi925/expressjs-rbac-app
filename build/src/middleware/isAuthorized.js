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
exports.isAuthorizedSocket = exports.areFriends = void 0;
const CaseRequests_1 = require("../../prisma/queries/CaseRequests");
function areFriends(userId, friendId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Query the database to check if there is a friendship entry between the two users
            const prisma = new client_1.PrismaClient();
            const friendship = yield prisma.friendship.findFirst({
                where: {
                    AND: [{ userId }, { friendId }],
                },
            });
            // Return true if friendship exists, false otherwise
            return friendship !== null;
        }
        catch (error) {
            console.error('Error checking friendship:', error);
            throw new Error('Failed to check friendship');
        }
    });
}
exports.areFriends = areFriends;
const client_1 = require("@prisma/client");
const isAuthorizedSocket = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract necessary data from the socket payload
        const { caseId, receiverId } = socket.handshake.query;
        const userId = socket.userId;
        if (!userId || typeof userId !== 'string') {
            throw new Error('user is unauthorized , try again later');
        }
        if (!receiverId || typeof receiverId !== 'string') {
            throw new Error('no reciever provided');
        }
        const { userRole } = socket;
        // Check if the sender and receiver are friends
        const areFriend = yield areFriends(userId, receiverId);
        // Instantiate PrismaCaseRequest
        const prismaCaseRequest = new CaseRequests_1.PrismaCaseRequest();
        // Retrieve case request based on user role
        let caseRequest;
        if (areFriend) {
            next();
        }
        else {
            if (!caseId || typeof caseId !== 'string') {
                throw new Error("Case ID is required for lawyer's role.");
            }
            if (userRole === 'LAWYER') {
                caseRequest = yield prismaCaseRequest.getCaseRequestByCaseAndLawyer(BigInt(caseId), userId);
            }
            else {
                caseRequest = yield prismaCaseRequest.getCaseRequestByCaseAndClient(BigInt(caseId), userId);
            }
            // Check if the case request exists and is accepted
            if ((!caseRequest || caseRequest.status !== 'ACCEPTED') && !areFriend) {
                throw new Error('User is not authorized to perform this action.');
            }
        }
        // User is authorized
        next();
    }
    catch (error) {
        console.error('Error in isAuthorizedSocket:', error);
        next(error);
    }
});
exports.isAuthorizedSocket = isAuthorizedSocket;

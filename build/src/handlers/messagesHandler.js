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
exports.getMessages = exports.markMessageAsSeen = exports.sendMessage = void 0;
const PrismaMessages_1 = require("../../prisma/queries/PrismaMessages");
const prismaMessages = new PrismaMessages_1.PrismaMessages();
function sendMessage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { senderId, receiverId, content } = req.body;
            const message = yield prismaMessages.sendMessage(senderId, receiverId, content);
            res.status(201).json({ message });
        }
        catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.sendMessage = sendMessage;
function markMessageAsSeen(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { messageId } = req.params;
            yield prismaMessages.markMessageAsSeen(messageId);
            res.status(200).json({ message: 'Message marked as seen' });
        }
        catch (error) {
            console.error('Error marking message as seen:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.markMessageAsSeen = markMessageAsSeen;
function getMessages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { userId } = req;
            const { limit, offset } = req.body;
            const messages = yield prismaMessages.getMessages(userId, limit, offset);
            res.status(200).json({ messages });
        }
        catch (error) {
            console.error('Error getting messages:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    });
}
exports.getMessages = getMessages;

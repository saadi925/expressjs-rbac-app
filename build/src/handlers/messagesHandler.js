"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessages = exports.markMessageAsSeen = exports.sendMessage = void 0;
const PrismaMessages_1 = require("../../prisma/queries/PrismaMessages");
const prismaMessages = new PrismaMessages_1.PrismaMessages();
async function sendMessage(req, res) {
    try {
        const { senderId, receiverId, content } = req.body;
        const message = await prismaMessages.sendMessage(senderId, receiverId, content);
        res.status(201).json({ message });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.sendMessage = sendMessage;
async function markMessageAsSeen(req, res) {
    try {
        const { messageId } = req.params;
        await prismaMessages.markMessageAsSeen(messageId);
        res.status(200).json({ message: 'Message marked as seen' });
    }
    catch (error) {
        console.error('Error marking message as seen:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.markMessageAsSeen = markMessageAsSeen;
async function getMessages(req, res) {
    try {
        const { userId } = req;
        if (!userId || typeof userId !== 'string') {
            res.status(401).json({ error: 'unauthorized' });
            return;
        }
        const { limit, offset, recieverId } = req.body;
        const messages = await prismaMessages.getMessages(userId, recieverId, limit, offset);
        res.status(200).json({ messages });
    }
    catch (error) {
        console.error('Error getting messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
exports.getMessages = getMessages;

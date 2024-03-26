"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const PrismaMessages_1 = require("../prisma/queries/PrismaMessages");
const prisma_1 = require("../prisma");
const xss_1 = __importDefault(require("xss"));
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const middleware_1 = require("./middleware");
class MessageHandler {
    prismaMessages;
    io;
    constructor(io) {
        this.prismaMessages = new PrismaMessages_1.PrismaMessages();
        this.io = io;
    }
    fetchOlderMessages = async (req, res) => {
        try {
            const { userId, pageNumber = '1', pageSize = '30' } = req.query;
            if (!userId || typeof userId !== 'string') {
                throw new Error('Invalid user ID');
            }
            if (!pageSize ||
                typeof pageSize !== 'string' ||
                !pageNumber ||
                typeof pageNumber !== 'string') {
                throw new Error('invalid page');
            }
            const skip = (Number(pageNumber) - 1) * Number(pageSize);
            const olderMessages = await this.prismaMessages.getMessages(userId, Number(pageSize), skip);
            res.status(200).json(olderMessages);
        }
        catch (error) {
            console.error('Error fetching older messages:', error);
            res.status(500).json({ error: 'Failed to fetch older messages' });
        }
    };
    sendMessage = async ({ senderId, receiverId, content }) => {
        try {
            const [sender, receiver] = await Promise.all([
                prisma_1.prisma.user.findUnique({ where: { id: senderId } }),
                prisma_1.prisma.user.findUnique({ where: { id: receiverId } }),
            ]);
            if (!sender || !receiver) {
                throw new Error('Sender or receiver does not exist');
            }
            const sanitizedContent = (0, xss_1.default)(content);
            const emojiRegexPattern = (0, emoji_regex_1.default)();
            const isValidEmoji = emojiRegexPattern.test(sanitizedContent);
            if (sanitizedContent.length > 1000) {
                throw new Error('Message exceeds maximum length');
            }
            if (isValidEmoji) {
                throw new Error('Invalid emoji');
            }
            const message = await this.prismaMessages.sendMessage(senderId, receiverId, sanitizedContent);
            await Promise.all([
                prisma_1.prisma.user.update({
                    where: { id: senderId },
                    data: { sentMessages: { connect: { id: message.id } } },
                }),
                prisma_1.prisma.user.update({
                    where: { id: receiverId },
                    data: { receivedMessages: { connect: { id: message.id } } },
                }),
            ]);
            this.io.to(receiverId).emit('message', message);
        }
        catch (error) {
            console.error('Error sending message:', error);
        }
    };
    markMessageAsSeen = async (messageId) => {
        try {
            await this.prismaMessages.markMessageAsSeen(messageId);
        }
        catch (error) {
            console.error('Error marking message as seen:', error);
        }
    };
}
const socketHandler = (io) => (socket) => {
    console.log('A user connected');
    const messageHandler = new MessageHandler(io);
    socket.use((packet, next) => {
        (0, middleware_1.authSocketMiddleware)(socket, (err) => {
            if (err) {
                console.error('Error in authMiddleware:', err);
                return next(err);
            }
            next();
        });
    });
    // Apply isAuthorized middleware to specific socket events
    socket.use((packet, next) => {
        const authorizedEvents = [
            'fetchOlderMessages',
            'sendMessage',
            'markMessageAsSeen',
        ];
        if (authorizedEvents.includes(packet[0])) {
            (0, middleware_1.isAuthorizedSocket)(socket, next);
        }
        else {
            next();
        }
    });
    socket.on('fetchOlderMessages', messageHandler.fetchOlderMessages);
    socket.on('sendMessage', messageHandler.sendMessage);
    socket.on('markMessageAsSeen', messageHandler.markMessageAsSeen);
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
};
exports.socketHandler = socketHandler;

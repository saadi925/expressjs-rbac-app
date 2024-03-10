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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketHandler = void 0;
const PrismaMessages_1 = require("../prisma/queries/PrismaMessages");
const prisma_1 = require("../prisma");
const xss_1 = __importDefault(require("xss"));
const emoji_regex_1 = __importDefault(require("emoji-regex"));
const isAuthorized_1 = require("./middleware/isAuthorized");
const socketAuth_1 = require("./middleware/socketAuth");
class MessageHandler {
    constructor(io) {
        this.fetchOlderMessages = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, pageNumber = '1', pageSize = '30' } = req.query;
                if (!userId || typeof userId !== 'string') {
                    throw new Error('Invalid user ID');
                }
                const skip = (Number(pageNumber) - 1) * Number(pageSize);
                const olderMessages = yield this.prismaMessages.getMessages(userId, Number(pageSize), skip);
                res.status(200).json(olderMessages);
            }
            catch (error) {
                console.error('Error fetching older messages:', error);
                res.status(500).json({ error: 'Failed to fetch older messages' });
            }
        });
        this.sendMessage = ({ senderId, receiverId, content }) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [sender, receiver] = yield Promise.all([
                    prisma_1.prisma.user.findUnique({ where: { id: senderId } }),
                    prisma_1.prisma.user.findUnique({ where: { id: receiverId } }),
                ]);
                if (!sender || !receiver) {
                    throw new Error('Sender or receiver does not exist');
                }
                // Sanitize the message content to prevent XSS attacks
                const sanitizedContent = (0, xss_1.default)(content);
                const emojiRegexPattern = (0, emoji_regex_1.default)();
                const isValidEmoji = emojiRegexPattern.test(sanitizedContent);
                // Validate message length
                if (sanitizedContent.length > 1000) {
                    throw new Error('Message exceeds maximum length');
                }
                if (isValidEmoji) {
                    throw new Error('Invalid emoji');
                }
                const message = yield this.prismaMessages.sendMessage(senderId, receiverId, sanitizedContent);
                yield Promise.all([
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
        });
        this.markMessageAsSeen = (messageId) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.prismaMessages.markMessageAsSeen(messageId);
            }
            catch (error) {
                console.error('Error marking message as seen:', error);
            }
        });
        this.prismaMessages = new PrismaMessages_1.PrismaMessages();
        this.io = io;
    }
}
const socketHandler = (io) => (socket) => {
    console.log('A user connected');
    const messageHandler = new MessageHandler(io);
    socket.use((packet, next) => {
        (0, socketAuth_1.authMiddleware)(socket, (err) => {
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
            (0, isAuthorized_1.isAuthorizedSocket)(socket, next);
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

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const routes_1 = require("./routes");
const socketIO_1 = require("./socketIO");
const app = (0, express_1.default)();
const friendRequestRoutes_1 = require("./routes/friendRequestRoutes");
const cities_1 = require("./utils/cities");
const authorizeRoutes_1 = require("./routes/authorizeRoutes");
const middleware_1 = require("./middleware");
app.get('/', (req, res) => {
    res.send('Hello World!');
});
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
io.on('connection', (0, socketIO_1.socketHandler)(io));
app.use('/auth', routes_1.authRoutes);
app.use('/api/user/authorize', authorizeRoutes_1.authorizeApi);
app.use('/user/profile', routes_1.profileRoutes);
app.use('/notifications', routes_1.notificationRoutes);
app.use('/client', routes_1.clientRoutes);
app.use('/lawyer', routes_1.lawyerRoutes);
app.use('/common', routes_1.commonRoutes);
app.use('/friend-requests', middleware_1.authMiddleware, friendRequestRoutes_1.friendRequestRoutes);
app.use('/api/get-cities', cities_1.getCities);
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error' });
});
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});

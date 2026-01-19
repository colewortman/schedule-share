"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const dbconfig_1 = __importDefault(require("./dbconfig"));
async function startServer() {
    try {
        await dbconfig_1.default.connect();
        console.log("Connected to the database successfully.");
        const app = (0, express_1.default)();
        app.use((0, cors_1.default)({
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        app.use(express_1.default.json());
        app.use('/', UserRoutes_1.default);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
}
startServer();

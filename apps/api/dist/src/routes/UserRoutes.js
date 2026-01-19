"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserService_1 = __importDefault(require("../service/UserService"));
const router = (0, express_1.Router)();
// Example route: Get all users
router.get('/users', async (_req, res) => {
    try {
        const users = await UserService_1.default.getAllUsers();
        res.status(200).json(users);
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.default = router;

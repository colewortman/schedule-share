"use strict";
// Handle business logic related to users
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRepository_1 = __importDefault(require("../repository/UserRepository"));
class UserService {
    static async getAllUsers() {
        const users = await UserRepository_1.default.getAllUsers();
        return users;
    }
}
exports.default = UserService;

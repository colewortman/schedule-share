"use strict";
// Handle all database operations related to users
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dbconfig_1 = __importDefault(require("../dbconfig"));
class UserRepository {
    static async getAllUsers() {
        const res = await dbconfig_1.default.query('SELECT * FROM schedule.users');
        return res.rows;
    }
}
exports.default = UserRepository;

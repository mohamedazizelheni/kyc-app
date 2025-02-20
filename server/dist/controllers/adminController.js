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
exports.getDashboardStats = void 0;
const User_1 = __importDefault(require("../models/User"));
const KycSubmission_1 = __importDefault(require("../models/KycSubmission"));
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.default.countDocuments({ role: 'User' });
        const totalKycSubmissions = yield KycSubmission_1.default.countDocuments();
        const pendingCount = yield KycSubmission_1.default.countDocuments({ status: 'pending' });
        const approvedCount = yield KycSubmission_1.default.countDocuments({ status: 'approved' });
        const rejectedCount = yield KycSubmission_1.default.countDocuments({ status: 'rejected' });
        res.json({
            totalUsers,
            totalKycSubmissions,
            pendingCount,
            approvedCount,
            rejectedCount,
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDashboardStats = getDashboardStats;

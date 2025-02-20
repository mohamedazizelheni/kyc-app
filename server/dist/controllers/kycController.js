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
exports.updateKycStatus = exports.getAllKycSubmissions = exports.getUserKycStatus = exports.submitKyc = void 0;
const KycSubmission_1 = __importDefault(require("../models/KycSubmission"));
const submitKyc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // Check if the user already has a KYC submission
        const existingSubmission = yield KycSubmission_1.default.findOne({ user: userId });
        // If there's an existing submission, enforce rules based on its status
        if (existingSubmission) {
            if (existingSubmission.status === 'pending') {
                return res.status(400).json({ message: 'KYC submission is already pending. Please wait for approval or rejection before resubmitting.' });
            }
            else if (existingSubmission.status === 'approved') {
                return res.status(400).json({ message: 'KYC is already approved. No need to resubmit.' });
            }
            else if (existingSubmission.status === 'rejected') {
                // If rejected, update the existing submission with the new document and reset status to pending.
                if (!req.file) {
                    return res.status(400).json({ message: 'Document file is required for resubmission.' });
                }
                existingSubmission.documentPath = req.file.path;
                existingSubmission.status = 'pending';
                existingSubmission.submittedAt = new Date();
                yield existingSubmission.save();
                return res.status(201).json({ message: 'KYC resubmission received', submission: existingSubmission });
            }
        }
        // If no submission exists, create a new one
        if (!req.file) {
            return res.status(400).json({ message: 'Document file is required.' });
        }
        const newSubmission = new KycSubmission_1.default({
            user: userId,
            documentPath: req.file.path,
        });
        yield newSubmission.save();
        return res.status(201).json({ message: 'KYC submission received', submission: newSubmission });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.submitKyc = submitKyc;
const getUserKycStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const submission = yield KycSubmission_1.default.findOne({ user: req.user.id });
        if (!submission) {
            return res.status(404).json({ message: 'No submission found' });
        }
        res.json(submission);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUserKycStatus = getUserKycStatus;
const getAllKycSubmissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // For admins: return all submissions with user details
        const submissions = yield KycSubmission_1.default.find().populate('user', 'name email');
        res.json(submissions);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllKycSubmissions = getAllKycSubmissions;
const updateKycStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        const submission = yield KycSubmission_1.default.findByIdAndUpdate(id, { status }, { new: true });
        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }
        res.json({ message: 'KYC status updated', submission });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateKycStatus = updateKycStatus;

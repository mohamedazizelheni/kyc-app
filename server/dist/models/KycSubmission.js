"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const kycSubmissionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    documentPath: { type: String, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    submittedAt: { type: Date, default: Date.now },
});
exports.default = (0, mongoose_1.model)('KycSubmission', kycSubmissionSchema);

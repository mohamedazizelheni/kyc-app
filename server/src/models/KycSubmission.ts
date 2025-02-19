import { Schema, model, Document, Types } from 'mongoose';

export type KycStatus = 'pending' | 'approved' | 'rejected';

export interface IKycSubmission extends Document {
  user: Types.ObjectId;
  documentPath: string;
  status: KycStatus;
  submittedAt: Date;
}

const kycSubmissionSchema = new Schema<IKycSubmission>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  documentPath: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  submittedAt: { type: Date, default: Date.now },
});

export default model<IKycSubmission>('KycSubmission', kycSubmissionSchema);

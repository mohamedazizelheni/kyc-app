import { Request, Response } from 'express';
import KycSubmission,{ IKycSubmission } from '../models/KycSubmission';

export const submitKyc = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    // Check if the user already has a KYC submission
    const existingSubmission: IKycSubmission | null = await KycSubmission.findOne({ user: userId });

    // If there's an existing submission, enforce rules based on its status
    if (existingSubmission) {
      if (existingSubmission.status === 'pending') {
        return res.status(400).json({ message: 'KYC submission is already pending. Please wait for approval or rejection before resubmitting.' });
      } else if (existingSubmission.status === 'approved') {
        return res.status(400).json({ message: 'KYC is already approved. No need to resubmit.' });
      } else if (existingSubmission.status === 'rejected') {
        // If rejected, update the existing submission with the new document and reset status to pending.
        if (!req.file) {
          return res.status(400).json({ message: 'Document file is required for resubmission.' });
        }
        existingSubmission.documentPath = req.file.path;
        existingSubmission.status = 'pending';
        existingSubmission.submittedAt = new Date();
        await existingSubmission.save();
        return res.status(201).json({ message: 'KYC resubmission received', submission: existingSubmission });
      }
    }

    // If no submission exists, create a new one
    if (!req.file) {
      return res.status(400).json({ message: 'Document file is required.' });
    }

    const newSubmission = new KycSubmission({
      user: userId,
      documentPath: req.file.path,
    });
    await newSubmission.save();
    return res.status(201).json({ message: 'KYC submission received', submission: newSubmission });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getUserKycStatus = async (req: Request, res: Response) => {
  try {
    const submission = await KycSubmission.findOne({ user: (req as any).user.id });
    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }
    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllKycSubmissions = async (req: Request, res: Response) => {
  try {
    // For admins: return all submissions with user details
    const submissions = await KycSubmission.find().populate('user', 'name email');
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateKycStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const submission = await KycSubmission.findByIdAndUpdate(id, { status }, { new: true });
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json({ message: 'KYC status updated', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

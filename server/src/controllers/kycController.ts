import { Request, Response } from 'express';
import KycSubmission from '../models/KycSubmission';

export const submitKyc = async (req: Request, res: Response) => {
  try {
    // Multer will attach the uploaded file to req.file
    const documentPath = req.file?.path;
    if (!documentPath) {
      return res.status(400).json({ message: 'No document uploaded' });
    }

    // Create a new KYC submission associated with the authenticated user
    const newSubmission = new KycSubmission({
      user: (req as any).user.id,
      documentPath,
    });
    await newSubmission.save();
    res.status(201).json({ message: 'KYC submission received', submission: newSubmission });
  } catch (error) {
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

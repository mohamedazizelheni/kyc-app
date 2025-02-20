import { Request, Response } from 'express';
import User from '../models/User';
import KycSubmission from '../models/KycSubmission';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'User' });
    const totalKycSubmissions = await KycSubmission.countDocuments();
    const pendingCount = await KycSubmission.countDocuments({ status: 'pending' });
    const approvedCount = await KycSubmission.countDocuments({ status: 'approved' });
    const rejectedCount = await KycSubmission.countDocuments({ status: 'rejected' });

    res.json({
      totalUsers,
      totalKycSubmissions,
      pendingCount,
      approvedCount,
      rejectedCount,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

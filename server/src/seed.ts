import User from './models/User';
import bcrypt from 'bcrypt';

export const seedAdmin = async () => {
  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'Admin' });
    if (!adminExists) {
      // Use environment variables if provided, otherwise default values
      const adminName = process.env.ADMIN_NAME || 'Admin';
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@kyc.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      // Create the admin user
      const adminUser = new User({
        name: adminName,
        email: adminEmail,
        password: hashedPassword,
        role: 'Admin',
      });
      await adminUser.save();
      console.log(`Admin user created: ${adminEmail}`);
    } else {
      console.log('Admin user already exists');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

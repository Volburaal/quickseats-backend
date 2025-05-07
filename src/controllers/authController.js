import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const OTPs = new Map();

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    if (!user.verified) {
      return res.status(400).json({ message: 'Account not verified.' });
   }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET);

    return res.status(200).json({ message: 'Login successful', token, user:{userId: user.id, role: user.role} });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  const { email, cnic, phone, password, role } = req.body;
  if (!email || !cnic || !phone || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { cnic },
        { phone },
      ]
    }
  });
  if (existingUser) {
    return res.status(400).json({ message: 'User with this email, CNIC, or phone already exists.' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    if(role === "ADMIN"){
      const newUser = await prisma.user.create({
        data: {
          email,
          cnic,
          phone,
          password: hashedPassword,
          role,
          verified: true,
        }
      });
  
      return res.status(201).json({ message: 'Admin created successfully', user: newUser });
    }
    const newUser = await prisma.user.create({
      data: {
        email,
        cnic,
        phone,
        password: hashedPassword,
      }
    });

    return res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const reset = async (req, res) => {
  console.log(req.body)
  const { email, newPassword } = req.body;
  if (!newPassword) {
    return res.status(400).json({ message: 'New password is required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: { password: hashedPassword },
    });

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verify = async (req, res) => {
  const { id } = req.params;
  const { selectedRole } = req.body
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { verified: true, role: selectedRole },
    });

    return res.status(200).json({ message: 'User account verified successfully', user: updatedUser });
  } catch (error) {
    console.error('Error during account verification:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({ message: 'User account deleted successfully' });
  } catch (error) {
    console.error('Error during account deletion:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};


export const getUnVerifiedAccounts = async (req, res) => {
  try {
    const accounts = await prisma.user.findMany({where:{verified: false}})
    return res.status(200).json(accounts);
  } catch (error) {
    console.error('Error while fetching unverified accounts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getVerifiedAccounts = async (req, res) => {
  try {
    const accounts = await prisma.user.findMany({where:{verified: true}})
    return res.status(200).json(accounts);
  } catch (error) {
    console.error('Error while fetching verified accounts:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending OTP email:', error);
  }
};

export const generateOtp = async (req, res) => {
  console.log(req.body)
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    OTPs.set(email, otp);
    await sendOtpEmail(email, otp);

    return res.status(200).json({ message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: 'Email and OTP are required.' });
  }
  try {
    const storedOtp = OTPs.get(email);
    if (!storedOtp) {
      return res.status(400).json({ message: 'OTP has expired or not generated.' });
    }
    if (storedOtp === otp) {
      OTPs.delete(email);
      return res.status(200).json({ message: 'OTP verified successfully.' });
    } else {
      return res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
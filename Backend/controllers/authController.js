import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';


// Replace this with your actual list of allowed admin emails
const ALLOWED_ADMIN_EMAILS = ['adithyanair74@gmail.com'];

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let assignedRole = 'user';

    if (role === 'admin') {
      if (ALLOWED_ADMIN_EMAILS.includes(email)) {
        assignedRole = 'admin'; 
      } else {
        return res.status(403).json({ message: "You are not allowed to register as admin" });
      }
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: assignedRole,
    });

    await user.save();

    res.json({ message: `User registered as ${assignedRole}` });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const login=async (req,res)=>{
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token });
}
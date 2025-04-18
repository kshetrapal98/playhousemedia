 const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');
const { signupSchema, loginSchema } = require('../validations/authValidation');

 
exports.signup = async (req, res) => {
  try {
    const { error, value } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map((err) => err.message),
      });
    }

    const { username, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({success: false, error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const { password: _, ...userData } = user.toObject();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: userData,
    });
  } catch (error) {
    res.status(500).json({

      error: 'Server error',
      details: error.message,
    });
  }
};

 
exports.login = async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map((err) => err.message),
      });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    const { password: _, ...userData } = user.toObject();

    res.status(200).json({
      success: true,
      message: 'Login successful',
      user: userData,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Server error',
      details: error.message,
    });
  }
};

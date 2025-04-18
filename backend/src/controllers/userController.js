 
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const {
  updateProfileSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} = require('../validations/userValidation');

// Get profile
exports.getProfile = async (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { error, value } = updateProfileSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        details: error.details.map((err) => err.message),
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    Object.assign(user, value);
    await user.save();

    const { password, ...userData } = user.toObject();
    res.status(200).json({ success: true, user: userData, message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Request password reset
exports.requestPasswordReset = async (req, res) => {
  try {
    const { error, value } = requestPasswordResetSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: 'Validation error', details: error.details.map((e) => e.message) });
    }

    const { email } = value;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: 'Validation error', details: error.details.map((e) => e.message) });
    }

    const { token } = req.params;
    const { newPassword } = value;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ success: false, error: 'Invalid or expired token' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

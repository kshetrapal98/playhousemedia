const express = require('express');
const protect = require('../middlewares/authMiddleware');
const {
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword
} = require('../controllers/userController');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/update-profile', protect, updateProfile);
router.post('/reset-password-request', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

module.exports = router;

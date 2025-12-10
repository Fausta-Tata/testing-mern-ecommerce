// backend/routes/testRoutes.js
// PENTING: Route ini hanya untuk TESTING, jangan diaktifkan di PRODUCTION!

const express = require('express');
const router = express.Router();

// Import models (sesuaikan dengan struktur project)
const User = require('../models/User');
const OTP = require('../models/OTP'); // Model untuk menyimpan OTP

/**
 * GET /api/test/get-otp/:email
 * Mendapatkan OTP terbaru untuk email tertentu
 * HANYA UNTUK TESTING!
 */
router.get('/get-otp/:email', async (req, res) => {
  // Check if in testing environment
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      success: false, 
      message: 'This endpoint is only available in test/dev environment' 
    });
  }

  try {
    const { email } = req.params;
    
    // Find the most recent OTP for this email
    const otpRecord = await OTP.findOne({ email })
      .sort({ createdAt: -1 }) // Get the latest OTP
      .limit(1);

    if (!otpRecord) {
      return res.status(404).json({ 
        success: false, 
        message: 'No OTP found for this email' 
      });
    }

    res.status(200).json({
      success: true,
      otp: otpRecord.otp,
      email: email
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * DELETE /api/test/clear-test-users
 * Menghapus semua test users (email dengan @test.com)
 * HANYA UNTUK TESTING!
 */
router.delete('/clear-test-users', async (req, res) => {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      success: false, 
      message: 'This endpoint is only available in test/dev environment' 
    });
  }

  try {
    // Delete users with test email domain
    const result = await User.deleteMany({ 
      email: { $regex: /@test\.com$/i } 
    });

    // Also clear related OTPs
    await OTP.deleteMany({ 
      email: { $regex: /@test\.com$/i } 
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} test users`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

/**
 * POST /api/test/set-fixed-otp
 * Set fixed OTP untuk testing (alternatif)
 */
router.post('/set-fixed-otp', async (req, res) => {
  if (process.env.NODE_ENV !== 'test' && process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ 
      success: false, 
      message: 'This endpoint is only available in test/dev environment' 
    });
  }

  try {
    const { email, otp = '123456' } = req.body;

    // Update or create OTP with fixed value
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Fixed OTP set successfully',
      otp
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
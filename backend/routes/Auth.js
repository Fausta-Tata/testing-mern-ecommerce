const express = require('express');
const router = express.Router();
const authController = require("../controllers/Auth");
const { verifyToken } = require('../middleware/VerifyToken');

router
  .post("/signup", authController.signup)
  .post('/login', authController.login)
  .post("/verify-otp", authController.verifyOtp)
  .post("/resend-otp", authController.resendOtp)
  .post("/forgot-password", authController.forgotPassword)
  .post("/reset-password", authController.resetPassword)
  .get("/check-auth", verifyToken, authController.checkAuth)
  .get('/logout', authController.logout);


if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  router.get('/test/get-otp/:userId', authController.getOtpForTesting);
  router.delete('/test/clear-test-users', authController.clearTestUsers);
  console.log('⚠️  Test routes enabled');
}

module.exports = router;
const express = require('express');
const router = express.Router();

const { login } = require('../Controllers/auth');

//ยืนยันตัวตนเข้าใช้งานระบบ และจะได้รับ Access Token
router.post('/login', login);

module.exports = router;
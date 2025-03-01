const express = require('express');
const router = express.Router();

const authControllers = require('../Controllers/auth');

//ยืนยันตัวตนเข้าใช้งานระบบ และจะได้รับ Access Token
router.post('/login', authControllers.login);

module.exports = router;
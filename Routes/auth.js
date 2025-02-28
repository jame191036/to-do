const express = require('express');
const router = express.Router();

const { login } = require('../Controllers/auth');

router.post('/login', login);

module.exports = router;
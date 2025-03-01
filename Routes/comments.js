const express = require('express');
const router = express.Router();

const commentControllers = require('../Controllers/comments');
const { auth } = require('../Middleware/auth');

//สร้าง comment ใหม่
router.post('/comments/createComment', auth, commentControllers.createComment);
//แก้ไข comment
router.put('/comments/editComment/:id', auth, commentControllers.editComment);
//ลบ comment
router.delete('/comments/deleteComment/:id', auth, commentControllers.deleteComment);

module.exports = router;
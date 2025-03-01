const express = require('express');
const router = express.Router();

const { createComment, editComment, deleteComment } = require('../Controllers/comments');
const { auth } = require('../Middleware/auth');

//สร้าง comment ใหม่
router.post('/comments/createComment', auth, createComment);
//แก้ไข comment
router.put('/comments/editComment/:id', auth, editComment);
//ลบ comment
router.delete('/comments/deleteComment/:id', auth, deleteComment);

module.exports = router;
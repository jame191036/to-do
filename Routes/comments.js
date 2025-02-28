const express = require('express');
const router = express.Router();

const { createComment, editComment, deleteComment } = require('../Controllers/comments');
const { auth } = require('../Middleware/auth');


router.post('/comments/createComment', auth, createComment);
router.put('/comments/editComment/:id', auth, editComment);
router.delete('/comments/deleteComment/:id', auth, deleteComment);

module.exports = router;
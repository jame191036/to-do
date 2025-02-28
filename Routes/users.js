const express = require('express');
const router = express.Router();

const { getOverView, getById, createUser, updateUser, changePassword, deleteUser } = require('../Controllers/users');
const { auth } = require('../Middleware/auth');

router.post('/users/getOverView', auth, getOverView);
router.get('/users/getById/:id', auth, getById);
router.post('/users/createUser', createUser);
router.put('/users/updateUser/:id', auth, updateUser);
router.put('/users/changePassword/:id', auth, changePassword);
router.delete('/users/deleteUser/:id', auth, deleteUser);

module.exports = router;
const express = require('express');
const router = express.Router();

const { getOverView, getById, createUser, updateUser, changePassword, deleteUser } = require('../Controllers/users');
const { auth } = require('../Middleware/auth');

//ดูข้อมูลของ user ทั้งหมด
router.post('/users/getOverView', auth, getOverView);
//ดูข้อมูลของ user ราย Item
router.get('/users/getById/:id', auth, getById);
//สร้าง user ใหม่
router.post('/users/createUser', createUser);
//แก้ไขข้อมูล user
router.put('/users/updateUser/:id', auth, updateUser);
//เปลี่ยนรหัสผ่านของ user
router.put('/users/changePassword/:id', auth, changePassword);
//ลบข้อมูลของ user
router.delete('/users/deleteUser/:id', auth, deleteUser);

module.exports = router;
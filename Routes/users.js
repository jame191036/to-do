const express = require('express');
const router = express.Router();

const userControllers = require('../Controllers/users');
const { auth } = require('../Middleware/auth');

//ดูข้อมูลของ user ทั้งหมด
router.post('/users/getOverView', auth, userControllers.getOverView);
//ดูข้อมูลของ user ราย Item
router.get('/users/getById/:id', auth, userControllers.getById);
//สร้าง user ใหม่
router.post('/users/createUser', userControllers.createUser);
//แก้ไขข้อมูล user
router.put('/users/updateUser/:id', auth, userControllers.updateUser);
//เปลี่ยนรหัสผ่านของ user
router.put('/users/changePassword/:id', auth, userControllers.changePassword);
//ลบข้อมูลของ user
router.delete('/users/deleteUser/:id', auth, userControllers.deleteUser);

module.exports = router;
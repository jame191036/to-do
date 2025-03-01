const express = require('express');
const router = express.Router();

const taskControllers = require('../Controllers/task');
const { auth } = require('../Middleware/auth');

// ดู task ทั้งหมด
router.post('/tasks/getOverView', auth, taskControllers.getOverView);
// ดู  task แบบราย Item
router.get('/tasks/getById/:id', auth, taskControllers.getByid);
// สร้าง Task ใหม่
router.post('/tasks/createTask/', auth, taskControllers.createTask);
// แก้ไขข้อมูล Task
router.put('/tasks/updateTask/:id', auth, taskControllers.updateTask);
// ลบ tesk
router.delete('/tasks/deleteTask/:id', auth, taskControllers.deleteTask);

module.exports = router;


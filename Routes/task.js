const express = require('express');
const router = express.Router();

const { getOverView, getByid, createTask, updateTask, deleteTask } = require('../Controllers/task');
const { auth } = require('../Middleware/auth');

// ดู task ทั้งหมด
router.post('/tasks/getOverView', auth, getOverView);
// ดู  task แบบราย Item
router.get('/tasks/getById/:id', auth, getByid);
// สร้าง Task ใหม่
router.post('/tasks/createTask/', auth, createTask);
// แก้ไขข้อมูล Task
router.put('/tasks/updateTask/:id', auth, updateTask);
// ลบ tesk
router.delete('/tasks/deleteTask/:id', auth, deleteTask);

module.exports = router;


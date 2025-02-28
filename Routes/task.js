const express = require('express');
const router = express.Router();

const { getOverView, getByid, createTask, updateTask, deleteTask } = require('../Controllers/task');
const { auth } = require('../Middleware/auth');

router.post('/tasks/getOverView', auth, getOverView);
router.get('/tasks/getById/:id', auth, getByid);
router.post('/tasks/createTask/', auth, createTask);
router.put('/tasks/updateTask/:id', auth, updateTask);
router.delete('/tasks/deleteTask/:id', auth, deleteTask);

module.exports = router;


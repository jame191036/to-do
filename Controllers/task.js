const { connectDB } = require('../Confing/db');
const sendEmail = require("./sendEmail");

const validStatuses = ['pending', 'in_progress', 'completed'];
const validPriorities = ['low', 'medium', 'high'];

exports.getOverView = async (req, res) => {
    try {
        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง SELECT ข้อมูล tasks
        let sql = `SELECT 
            task_id, 
            user_id, 
            title, 
            description, 
            status, 
            priority, 
            CONVERT_TZ(due_date, '+00:00', '+07:00') AS due_date
            FROM tasks`;

        let params = [];
        let conditions = [];

        //ตรวจสอบว่า req มี user_id ส่งมาไหมถ้าส่งมาให้ push เข้า conditions และ params
        if (req.body.user_id) {
            conditions.push('user_id = ?');
            params.push(req.body.user_id);
        }

        //ตรวจสอบว่า req มี title ส่งมาไหมถ้าส่งมาให้ push เข้า conditions และ params
        if (req.body.title) {
            conditions.push('title LIKE ?');
            params.push(`%${req.body.title}%`);
        }

        //ตรวจสอบว่า req มี status ส่งมาไหมถ้าส่งมาให้ push เข้า conditions และ params
        if (req.body.status) {
            conditions.push('status = ?');
            params.push(req.body.status);
        }

        //ตรวจสอบว่า req มี priority ส่งมาไหมถ้าส่งมาให้ push เข้า conditions และ params
        if (req.body.priority) {
            conditions.push('priority = ?');
            params.push(req.body.priority);
        }

        //ตรวจสอบว่า req มี due_date ส่งมาไหมถ้าส่งมาให้ push เข้า conditions และ params
        if (req.body.due_date) {
            conditions.push('DATE(due_date) = ?');
            params.push(req.body.due_date.split('T')[0]);
        }

        //ตรวจสอบว่า conditions มีค่าหรือไหมถ้ามีให้ concat WHERE เข้าในไป สำสั่ง SELECT
        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        const page = parseInt(req.body.page) || 1;  // Default page = 1
        const limit = parseInt(req.body.limit) || 10; // Default limit = 10
        const offset = (page - 1) * limit; // Calculate offset

        sql += ' LIMIT ? OFFSET ?';
        params.push(limit, offset);

        const [results] = await conn.query(sql, params);

        const countQuery = `SELECT COUNT(*) as total FROM tasks ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`;
        const [countResult] = await conn.query(countQuery, params.slice(0, -2)); // Exclude limit & offset from count query

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();
        // ส่งข้อมูลกลับ
        res.status(200).json({
            status: "200",
            message: "Data retrieved successfully",
            result: {
                total: countResult[0].total,
                page,
                limit,
                totalPages: Math.ceil(countResult[0].total / limit),
                data: results,
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "500",
            message: "Server Error",
            result: null
        });
    }
};


exports.getByid = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                status: "400",
                message: 'Invalid ID provided'
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง SELECT ข้อมูล tasks และ join กับ comment
        let sql = `
            SELECT 
                t.task_id, 
                t.user_id, 
                t.title, 
                t.description, 
                t.status, 
                t.priority, 
                CONVERT_TZ(t.due_date, '+00:00', '+07:00') AS due_date,
                CONVERT_TZ(t.created_at, '+00:00', '+07:00') AS created_at,
                CONVERT_TZ(t.updated_at, '+00:00', '+07:00') AS updated_at,
                c.comment_id,
                c.user_id,
                c.task_id,
                c.comment,
                CONVERT_TZ(c.created_at, '+00:00', '+07:00') AS comment_created_at,
                CONVERT_TZ(c.updated_at, '+00:00', '+07:00') AS comment_updated_at
            FROM tasks t
            LEFT JOIN comments c ON t.task_id = c.task_id
            WHERE t.task_id = ?`;

        //query
        const [results] = await conn.query(sql, [id]);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // เช็กว่ามีข้อมูลที่ select มาไหม
        if (results.length === 0) {
            return res.status(404).json({
                status: "404",
                message: 'Task not found'
            });
        }

        // set ข้อมูล task
        const task = {
            task_id: results[0].task_id,
            user_id: results[0].user_id,
            title: results[0].title,
            description: results[0].description,
            status: results[0].status,
            priority: results[0].priority,
            due_date: results[0].due_date,
            created_at: results[0].created_at,
            updated_at: results[0].updated_at,
            comments: []
        };

        // loop สำหรับ push ข้อมูล comment 
        results.forEach(row => {
            if (row.comment_id) {
                task.comments.push({
                    comment_id: row.comment_id,
                    task_id: row.task_id,
                    user_id: row.user_id,
                    comment: row.comment,
                    created_at: row.comment_created_at,
                    updated_at: row.comment_updated_at
                });
            }
        });

        // ส่งข้อมูลกลับ
        res.status(200).json({
            status: "200",
            message: "Data retrieved successfully",
            result: task
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "500",
            message: "Server Error",
            result: null
        });
    }
};

exports.createTask = async (req, res) => {
    try {
        // รับข้อมูลจาก request
        const { user_id, title, description, status, priority, due_date } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!user_id || !title || !description || !status || !priority || !due_date) {
            return res.status(400).json({
                status: "400",
                message: 'Missing required fields'
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: "400",
                message: "Invalid status. Allowed values: 'pending', 'in_progress', 'completed'"
            });
        }

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                status: "400",
                message: "Invalid priority. Allowed values: 'low', 'medium', 'high'"
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // สำสั่ง INSERT ข้อมูล tasks
        let sql = 'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)';
        // query
        const [result] = await conn.query(sql, [user_id, title, description, status, priority, due_date]);

        //query ขอมูลที่เพิ่ง insert ไปเพื่อนำข้อมูลไป res
        const [task] = await conn.query('SELECT * FROM tasks WHERE task_id = ?', [result.insertId]);
        // ถ้าข้อมูลที่เพิ่ม insert ไม่เจอให้ retrurn 500
        if (!task || task.length === 0) {
            return res.status(500).json({
                status: "500",
                message: 'Task retrieval failed'
            });
        }

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ส่งข้อมูลกลับ
        res.status(201).json({
            status: "201",
            message: 'Task added successfully',
            result: {
                task_id: task[0].task_id,
                user_id: task[0].user_id,
                title: task[0].title,
                description: task[0].description,
                status: task[0].status,
                priority: task[0].priority,
                due_date: task[0].due_date,
                created_at: task[0].created_at,
                updated_at: task[0].updated_at
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "500",
            message: "Server Error",
            result: null
        });
    }
};

exports.updateTask = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;
        // รับข้อมูลจาก request
        const { title, description, status, priority, due_date } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!title || !description || !status || !priority || !due_date) {
            return res.status(400).json({
                status: "400",
                message: 'Missing required fields'
            });
        }

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: "400",
                message: "Invalid status. Allowed values: 'pending', 'in_progress', 'completed'"
            });
        }

        if (!validPriorities.includes(priority)) {
            return res.status(400).json({
                status: "400",
                message: "Invalid priority. Allowed values: 'low', 'medium', 'high'"
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // สำสั่ง select เพื่อนำข้อมูลส่ง Email แจ้งเตือน 
        let sqltaskData = `SELECT
                        t.title, 
                        t.description,
                        t.status,
                        t.priority,
                        CONVERT_TZ(t.due_date, '+00:00', '+07:00') AS due_date,
                        u.email
                        FROM tasks t
                        LEFT JOIN users u ON t.user_id = u.user_id
                        WHERE t.task_id = ?`;
        const [taskData] = await conn.query(sqltaskData, id);

        // สำสั่ง UPDATE ข้อมูล tasks
        let sql = 'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = NOW()';
        // set param
        let params = [title, description, status, priority, due_date];

        // set param
        sql += ' WHERE task_id = ?';
        params.push(id);

        // Query
        const [result] = await conn.query(sql, params);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ถ้าไม่มีการ update ให้ return ว่าหา Task นี้ไม่เจอ
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "400",
                message: 'task not found'
            });
        }

        // ส่ง Email
        if (taskData[0]) {
            const formattedDateDueDate = new Date(taskData[0].due_date).toLocaleDateString('en-GB');
            const formattedDateDueDateUpdate = new Date(due_date).toLocaleDateString('en-GB');

            const subject_msg = 'Task มีการอัพเดท';
            const html_msg = `
                <p>มีการอัพเดท Task</p>
                <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse;">
                    <tr>
                        <th style="background-color: #f2f2f2;">Field</th>
                        <th style="background-color: #f2f2f2;">Old Value</th>
                        <th style="background-color: #f2f2f2;">New Value</th>
                    </tr>
                    <tr>
                        <td><strong>Title</strong></td>
                        <td>${taskData[0].title}</td>
                        <td>${title}</td>
                    </tr>
                    <tr>
                        <td><strong>Description</strong></td>
                        <td>${taskData[0].description}</td>
                        <td>${description}</td>
                    </tr>
                    <tr>
                        <td><strong>Status</strong></td>
                        <td>${taskData[0].status}</td>
                        <td>${status}</td>
                    </tr>
                    <tr>
                        <td><strong>Priority</strong></td>
                        <td>${taskData[0].priority}</td>
                        <td>${priority}</td>
                    </tr>
                    <tr>
                        <td><strong>Due Date</strong></td>
                        <td>${formattedDateDueDate}</td>
                        <td>${formattedDateDueDateUpdate}</td>
                    </tr>
                </table>
                <br>
                <p>กรุณาตรวจสอบการอัพเดทข้อมูล</p>`;

            // ส่ง email ไปแจ้งเตือนการ update task
            sendEmail(taskData[0].email, subject_msg, html_msg);
        }

        // ส่งข้อมูลกลับ
        res.status(200).json({
            status: "200",
            message: 'Task updated successfully',
            result: {
                task_id: id,
                title,
                description,
                status,
                priority,
                due_date
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "500",
            message: "Server Error",
            result: null
        });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                status: "400",
                message: 'Invalid Task ID provided'
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง DELETE ข้อมูล tasks
        const sql = 'DELETE FROM tasks WHERE task_id = ?';
        //query
        const [result] = await conn.query(sql, [id]);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ถ้าไม่มีการบลขอมูลให้ return ว่าหา task นี้ไม่เจอ
        if (result.affectedRows === 0) {
            // return res.status(404).json({ error: 'Task not found' });
            return res.status(404).json({
                status: "404",
                message: 'Task not found'
            });
        }

        // ส่งข้อมูลกลับ
        res.status(200).json({
            status: "200",
            message: 'Task deleted successfully'
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: "500",
            message: "Server Error",
            result: null
        });
    }
};



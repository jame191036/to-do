const { connectDB } = require('../Confing/db');

exports.getOverView = async (req, res) => {
    try {
        const conn = await connectDB(); // Create a connection
        let sql = `SELECT 
            task_id, 
            user_id, 
            title, 
            description, 
            status, 
            priority, 
            CONVERT_TZ(due_date, '+00:00', '+07:00') AS due_date
            FROM tasks`;

        // let sql = 'SELECT * FROM tasks'; // Base query
        let params = [];
        let conditions = [];

        if (req.body.user_id) {
            conditions.push('user_id = ?');
            params.push(req.body.user_id);
        }

        if (req.body.title) {
            conditions.push('title LIKE ?');
            params.push(`%${req.body.title}%`);
        }

        if (req.body.status) {
            conditions.push('status = ?');
            params.push(req.body.status);
        }

        if (req.body.priority) {
            conditions.push('priority = ?');
            params.push(req.body.priority);
        }

        if (req.body.due_date) {
            conditions.push('DATE(due_date) = ?');
            params.push(req.body.due_date.split('T')[0]);
        }

        if (conditions.length > 0) {
            sql += ' WHERE ' + conditions.join(' AND ');
        }

        console.log(sql);
        console.log(params);

        const [results] = await conn.query(sql, params);
        res.json(results);

        await conn.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.getByid = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid ID provided' });
        }

        const conn = await connectDB();
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

        const [results] = await conn.query(sql, [id]);

        await conn.end();

        if (results.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

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

        res.json(task);
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.createTask = async (req, res) => {
    try {
        const { user_id, title, description, status, priority, due_date } = req.body;

        if (!user_id || !title || !description || !status || !priority || !due_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const conn = await connectDB();

        let sql = 'INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?)';

        const [result] = await conn.query(sql, [user_id, title, description, status, priority, due_date]);

        const [task] = await conn.query('SELECT * FROM tasks WHERE task_id = ?', [result.insertId]);

        if (!task || task.length === 0) {
            return res.status(500).json({ error: 'Task retrieval failed' });
        }

        res.status(201).json({
            message: 'Task added successfully',
            task_id: task[0].task_id,
            user_id: task[0].user_id,
            title: task[0].title,
            description: task[0].description,
            status: task[0].status,
            priority: task[0].priority,
            due_date: task[0].due_date,
            created_at: task[0].created_at,
            updated_at: task[0].updated_at
        });

        await conn.end();

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, priority, due_date } = req.body;

        if (!title || !description || !status || !priority || !due_date) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const conn = await connectDB();

        let sql = 'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = NOW()';

        let params = [title, description, status, priority, due_date];

        sql += ' WHERE task_id = ?';
        params.push(id);

        const [result] = await conn.query(sql, params);

        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'task not found' });
        }

        res.json({
            message: 'Task updated successfully',
            task_id: id,
            updated_task: {
                title,
                description,
                status,
                priority,
                due_date
            }
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid Task ID provided' });
        }

        const conn = await connectDB();
        const sql = 'DELETE FROM tasks WHERE task_id = ?';
        const [result] = await conn.query(sql, [id]);

        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({
            message: 'Task deleted successfully',
            task_id: id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};



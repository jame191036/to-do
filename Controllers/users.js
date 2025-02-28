const { connectDB } = require('../Confing/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getOverView = async (req, res) => {
    try {
        const conn = await connectDB();
        let sql = `SELECT 
                    user_id, 
                    username, 
                    email
                    FROM users`;

        // let sql = 'SELECT * FROM users'; // Base query
        let params = [];

        if (req.body.username) {
            sql += params.length ? ' AND' : ' WHERE';
            sql += ' username = ?';
            params.push(req.body.username);
        }

        if (req.body.email) {
            sql += params.length ? ' AND' : ' WHERE';
            sql += ' email = ?';
            params.push(req.body.email);
        }

        const [results] = await conn.query(sql, params);
        res.json(results);

        await conn.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid ID provided' });
        }

        const conn = await connectDB();
        let sql = `SELECT 
                user_id, 
                username, 
                email,
                CONVERT_TZ(created_at, '+00:00', '+07:00') AS created_at,
                CONVERT_TZ(updated_at, '+00:00', '+07:00') AS updated_at
                FROM users WHERE user_id = ?`;
        // const sql = 'SELECT * FROM users WHERE user_id = ?';
        const [results] = await conn.query(sql, [id]);

        await conn.end();

        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.createUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            })
        }

        const conn = await connectDB();

        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // เข้ารหัสรหัสผ่าน
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';

        const [result] = await conn.query(sql, [username, email, hashedPassword]); // ใช้ hashedPassword

        const [user] = await conn.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);

        if (!user || user.length === 0) {
            return res.status(500).json({ error: 'User retrieval failed' });
        }

        res.status(201).json({
            message: 'user added successfully',
            user_id: user[0].user_id,
            username: user[0].username,
            email: user[0].email,
            created_at: user[0].created_at,
            updated_at: user[0].updated_at
        });

        await conn.end();

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email } = req.body;

        if (!username || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            })
        }

        const conn = await connectDB();

        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        let sql = 'UPDATE users SET username = ?, email = ?, updated_at = NOW()';

        let params = [username, email];

        sql += ' WHERE user_id = ?';
        params.push(id);

        const [result] = await conn.query(sql, params);

        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'user not found' });
        }

        res.json({
            message: 'User updated successfully',
            user_id: id,
            updated_user: {
                username,
                email
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { id } = req.params;
        const { current_password, new_password } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const conn = await connectDB();

        const [user] = await conn.query('SELECT password FROM users WHERE user_id = ?', [id]);

        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(current_password, user[0].password);

        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        await conn.query('UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?', [hashedPassword, id]);

        res.status(200).json({ message: 'Password changed successfully' });

        await conn.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid User ID provided' });
        }

        const conn = await connectDB();
        const sql = 'DELETE FROM users WHERE user_id = ?';
        const [result] = await conn.query(sql, [id]);

        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'User deleted successfully',
            task_id: id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};



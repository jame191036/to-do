const { connectDB } = require('../Confing/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.getOverView = async (req, res) => {
    try {
        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง SELECT ข้อมูล tasks
        let sql = `SELECT 
                    user_id, 
                    username, 
                    email
                    FROM users`;

        // let sql = 'SELECT * FROM users'; // Base query
        // ประการตัวแปล params
        let params = [];

        //ตรวจสอบว่า req มี username ส่งมาไหมถ้าส่งมาให้ push เข้า params
        if (req.body.username) {
            sql += params.length ? ' AND' : ' WHERE';
            sql += ' username = ?';
            params.push(req.body.username);
        }

        //ตรวจสอบว่า req มี email ส่งมาไหมถ้าส่งมาให้ push เข้า params
        if (req.body.email) {
            sql += params.length ? ' AND' : ' WHERE';
            sql += ' email = ?';
            params.push(req.body.email);
        }

        //query
        const [results] = await conn.query(sql, params);
        // ส่งให้มูลกลับ
        res.json(results);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.getById = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid ID provided' });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง SELECT ข้อมูล users 
        let sql = `SELECT 
                user_id, 
                username, 
                email,
                CONVERT_TZ(created_at, '+00:00', '+07:00') AS created_at,
                CONVERT_TZ(updated_at, '+00:00', '+07:00') AS updated_at
                FROM users WHERE user_id = ?`;
        // const sql = 'SELECT * FROM users WHERE user_id = ?';
        //query
        const [results] = await conn.query(sql, [id]);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // เช็กว่ามีข้อมูลที่ select มาไหม
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // ส่งให้มูลกลับ
        res.json(results[0]);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.createUser = async (req, res) => {
    try {
        // รับข้อมูลจาก request
        const { username, email, password } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // เช็กรูปแบบ email ว่าถูกต้องไหม
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            })
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // query หาข้อมูลว่า user หรือ email นี้มีอยู่ใน DataBase แล้วหรือไม่
        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        // ถ้ามีแล้วให้แจ้งว่ามีผู้ใช่งาน user หรือ email นี้แล้ว
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // เข้ารหัสรหัสผ่าน
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // สำสั่ง INSERT ข้อมูล users
        let sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        // query
        const [result] = await conn.query(sql, [username, email, hashedPassword]);
        //query ขอมูลที่เพิ่ง insert ไปเพื่อนำข้อมูลไป res
        const [user] = await conn.query('SELECT * FROM users WHERE user_id = ?', [result.insertId]);
        // ถ้าข้อมูลที่เพิ่ม insert ไม่เจอให้ retrurn 500
        if (!user || user.length === 0) {
            return res.status(500).json({ error: 'User retrieval failed' });
        }

        // ส่งให้มูลกลับ
        res.status(201).json({
            message: 'user added successfully',
            user_id: user[0].user_id,
            username: user[0].username,
            email: user[0].email,
            created_at: user[0].created_at,
            updated_at: user[0].updated_at
        });

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.updateUser = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;
        // รับข้อมูลจาก request
        const { username, email } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!username || !email) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // เช็กรูปแบบ email ว่าถูกต้องไหม
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: 'Invalid email format'
            })
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // query หาข้อมูลว่า user หรือ email นี้มีอยู่ใน DataBase แล้วหรือไม่
        const [existingUser] = await conn.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        // ถ้ามีแล้วให้แจ้งว่ามีผู้ใช่งาน user หรือ email นี้แล้ว
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // สำสั่ง UPDATE ข้อมูล users
        let sql = 'UPDATE users SET username = ?, email = ?, updated_at = NOW()';

        // set param
        let params = [username, email];

        // set param
        sql += ' WHERE user_id = ?';
        params.push(id);

        // Query
        const [result] = await conn.query(sql, params);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ถ้าไม่มีการ update ให้ return ว่าหา user นี้ไม่เจอ
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'user not found' });
        }

        // ส่งให้มูลกลับ
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
        //รับ id จาก params
        const { id } = req.params;
        // รับข้อมูลจาก request
        const { current_password, new_password } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!current_password || !new_password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // query หาข้อมูล user ที่ต้องการเปลี่ยนรหัสผ่าน
        const [user] = await conn.query('SELECT password FROM users WHERE user_id = ?', [id]);

        // เช็กว่าเจอข้อมูลหรือไม่
        if (!user || user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // เช็กรหัสผ่านเดิมที่กรอกเข้ามาว่าถูกต้องไหม
        const isMatch = await bcrypt.compare(current_password, user[0].password);

        // ถ้ากรอกรหัสผ่านเดิมไม่ถูกต้องให้ return 400
        if (!isMatch) {
            return res.status(400).json({ error: 'Current password is incorrect' });
        }

        // เข้ารหัสรหัสผ่าน
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(new_password, saltRounds);

        // Query Update users
        await conn.query('UPDATE users SET password = ?, updated_at = NOW() WHERE user_id = ?', [hashedPassword, id]);

        //ส่งข้อมูลกลับ
        res.status(200).json({ message: 'Password changed successfully' });
        
        // ปิดการติดต่อฐานข้อมูล
        await conn.end();
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid User ID provided' });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง DELETE ข้อมูล tasks
        const sql = 'DELETE FROM users WHERE user_id = ?';
        //query 
        const [result] = await conn.query(sql, [id]);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ถ้าไม่มีการบลขอมูลให้ return ว่าหา User นี้ไม่เจอ
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // ส่งให้มูลกลับ
        res.json({
            message: 'User deleted successfully',
            task_id: id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};



const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { connectDB } = require('../Confing/db');

exports.login = async (req, res) => {
    try {
        // รับข้อมูลจาก request
        const { username, password } = req.body;
        
        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        
        // Query ข้อมูล user
        const [users] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);

        // ตรวจสอบว่าเจอ username ที่กรอกมาไหม
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // นำข้อมูลที่ Query มาได้เข้าตัวแปล user
        const user = users[0];

        // ตรวจสอบว่า password ตรงกับที่กรอกมาไหม
        const isMatch = await bcrypt.compare(password, user.password);

        // ถ้าไม่ตรงให้ return 401
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a JWT token
        const token = jwt.sign(
            { user_id: user.user_id, username: user.username }, 'jwtsecret', { expiresIn: '1h' } 
        );

        // ส่งให้มูลกลับพร้อม token
        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server Error' });
    }
};

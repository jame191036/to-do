const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const { connectDB } = require('../Confing/db');

exports.login = async (req, res) => {
    try {
        // รับข้อมูลจาก request
        const { username, password } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!username || !password) {
            return res.status(400).json({
                status: "400",
                message: 'Username and password are required'
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // Query ข้อมูล user
        const [users] = await conn.query('SELECT * FROM users WHERE username = ?', [username]);

        // ตรวจสอบว่าเจอ username ที่กรอกมาไหม
        if (users.length === 0) {
            return res.status(401).json({
                status: "401",
                message: 'Invalid username or password'
            });
        }

        // นำข้อมูลที่ Query มาได้เข้าตัวแปล user
        const user = users[0];

        // ตรวจสอบว่า password ตรงกับที่กรอกมาไหม
        const isMatch = await bcrypt.compare(password, user.password);

        // ถ้าไม่ตรงให้ return 401
        if (!isMatch) {
            return res.status(401).json({
                status: "401",
                message: 'Invalid username or password'
            });
        }

        // // Generate a JWT token
        // const token = jwt.sign(
        //     { user_id: user.user_id, username: user.username }, 'jwtsecret', { expiresIn: '5m' }
        // );

        // const refreshToken = jwt.sign(
        //     { nuser_id: user.user_id, username: user.username }, 'jwtsecret', { expiresIn: "5m" }
        // );
        const token = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // ส่งข้อมูลกลับพร้อม token
        res.status(200).json({
            status: "200",
            message: 'Login successful',
            token,
            refreshToken,
            result: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                created_at: user.created_at,
                updated_at: user.updated_at
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "500",
            message: "Server Error",
            result: null
        });
    }
};


exports.refreshToken = async (req, res) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            status: "401",
            message: 'Refresh token is missing'
        });
    }

    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({
                status: "403",
                message: 'Invalid or expired refresh token'
            });
        }

        const newAccessToken = generateAccessToken(user);

        // res.json({ accessToken: newAccessToken });
        res.status(200).json({
            status: "200",
            accessToken: newAccessToken
        });
    });
};

// exports.logout = async (req, res) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         return res.status(400).json({
//             status: "401",
//             message: 'Refresh token required'
//         });
//     }

//     // Remove refresh token from storage (use database in real applications)
//     refreshTokens = refreshTokens.filter(token => token !== refreshToken);

//     console.log(refreshTokens);
    
//     return res.status(200).json({
//         status: "200",
//         message: 'Logged out successfully'
//     });
// };


// Generate access token
const generateAccessToken = (user) => {
    return jwt.sign({ user_id: user.user_id, username: user.username }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
    });
};

// Generate refresh token
const generateRefreshToken = (user) => {
    return jwt.sign({ user_id: user.user_id }, process.env.JWT_REFRESH_SECRET_KEY, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
    });
};


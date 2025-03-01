const { connectDB } = require('../Confing/db');
const sendEmail = require("./sendEmail");

exports.createComment = async (req, res) => {
    try {
        // รับข้อมูลจาก request
        const { task_id, user_id, comment } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!task_id || !user_id || !comment) {
            return res.status(400).json({
                status: "400",
                message: 'Missing required fields'
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง insert ข้อมูล comment
        let sql = 'INSERT INTO comments (task_id, user_id, comment) VALUES (?, ?, ?)';
        //query
        const [result] = await conn.query(sql, [task_id, user_id, comment]);
        //query ขอมูลที่เพิ่ง insert ไปเพื่อนำข้อมูลไป res
        const [commentData] = await conn.query('SELECT * FROM comments WHERE comment_id = ?', [result.insertId]);

        // ถ้าข้อมูลที่เพิ่ม insert ไม่เจอให้ retrurn 500
        if (!commentData || commentData.length === 0) {
            return res.status(500).json({
                status: "500",
                message: 'commentData retrieval failed'
            });
        }

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ส่งให้มูลกลับ
        res.status(201).json({
            status: "201",
            message: 'Comment added successfully',
            result: {
                comment_id: commentData[0].comment_id,
                task_id: commentData[0].task_id,
                user_id: commentData[0].user_id,
                comment: commentData[0].comment,
                created_at: commentData[0].created_at,
                updated_at: commentData[0].updated_at
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

exports.editComment = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;
        // รับข้อมูลจาก request
        const { user_id, task_id, comment } = req.body;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!comment) {
            return res.status(400).json({
                status: "400",
                message: 'Missing required field: comment'
            });
        }

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (isNaN(user_id)) {
            return res.status(400).json({
                status: "400",
                message: 'Invalid user_id'
            });
        }

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (isNaN(task_id)) {
            return res.status(400).json({
                status: "400",
                message: 'Invalid task_id'
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();

        // สำสั่ง SELECT ข้อมูล comment
        let sqlSelect = 'SELECT * FROM comments c WHERE c.comment_id = ? AND c.task_id = ? AND c.user_id = ?';
        // set param
        let paramsSelectComment = [id, task_id, user_id];
        //query
        const [commentData] = await conn.query(sqlSelect, paramsSelectComment);

        // ถ้า query ไม่เจอให้ retrurn 500 เพราะต้องเป็น comment ของ user ที่สร้างเอง
        if (!commentData[0] || commentData[0].length === 0) {
            return res.status(500).json({
                status: "500",
                message: 'Unable to update comment'
            });
        }

        //query หา user
        const [userData] = await conn.query('SELECT * FROM users u WHERE user_id = ?', user_id);

        if (userData[0]) {
            const subject_msg = await 'Comment มีการอัพเดท';
            const text_msg = await 'มีการอัพเดท comment จาก ' + commentData[0].comment + ' เป็น ' + comment;

            // ส่ง email ไปแจ้งเตือนการ update comment
            await sendEmail(userData[0].email, subject_msg, text_msg);
        }

        // สำสั่ง UPDATE ข้อมูล comment
        let sql = 'UPDATE comments SET comment = ?, updated_at = NOW()';
        // set param
        let params = [comment];

        // if (user_id) {
        //     sql += ', user_id = ?';
        //     params.push(user_id);
        // }

        // set param
        sql += ' WHERE comment_id = ?';
        params.push(id);

        //query
        const [result] = await conn.query(sql, params);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ถ้าไม่มีการ update ให้ return ว่าหา comment นี้ไม่เจอ
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "404",
                message: 'Comment not found'
            });
        }

        // ส่งให้มูลกลับ
        res.status(200).json({
            status: "200",
            message: 'Comment updated successfully',
            result: {
                comment_id: id,
                user_id: user_id || null,
                comment
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.deleteComment = async (req, res) => {
    try {
        //รับ id จาก params
        const { id } = req.params;

        // ตรวจสอบว่าได้รับข้อมูลครบที่ต้องการครบไหม
        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({
                status: "400",
                message: 'Invalid comment ID provided'
            });
        }

        // ติดต่อฐานข้อมูล
        const conn = await connectDB();
        // สำสั่ง DELETE ข้อมูล comment
        const sql = 'DELETE FROM comments WHERE comment_id = ?';
        //query
        const [result] = await conn.query(sql, [id]);

        // ปิดการติดต่อฐานข้อมูล
        await conn.end();

        // ถ้าไม่มีการบลขอมูลให้ return ว่าหา comment นี้ไม่เจอ
        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "404",
                message: 'Comment not found'
            });
        }

        // ส่งให้มูลกลับ
        res.status(200).json({
            status: "200",
            message: 'Comment deleted successfully'
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




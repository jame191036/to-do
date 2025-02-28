const { connectDB } = require('../Confing/db');

exports.createComment = async (req, res) => {
    try {
        const { task_id, user_id, comment } = req.body;

        if (!task_id || !user_id || !comment) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const conn = await connectDB();

        let sql = 'INSERT INTO comments (task_id, user_id, comment) VALUES (?, ?, ?)';

        const [result] = await conn.query(sql, [task_id, user_id, comment]);

        const [commentData] = await conn.query('SELECT * FROM comments WHERE comment_id = ?', [result.insertId]);

        if (!commentData || commentData.length === 0) {
            return res.status(500).json({ error: 'commentData retrieval failed' });
        }

        await conn.end();

        res.status(201).json({
            message: 'Comment added successfully',
            comment_id: commentData[0].comment_id,
            task_id: commentData[0].task_id,
            user_id: commentData[0].user_id,
            comment: commentData[0].comment,
            created_at: commentData[0].created_at,
            updated_at: commentData[0].updated_at
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};

exports.editComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { user_id, task_id, comment } = req.body;

        if (!comment) {
            return res.status(400).json({ error: 'Missing required field: comment' });
        }

        if (isNaN(user_id)) {
            return res.status(400).json({ error: 'Invalid user_id' });
        }

        if (isNaN(task_id)) {
            return res.status(400).json({ error: 'Invalid task_id' });
        }

        const conn = await connectDB();

        let sqlSelect = 'SELECT * FROM comments c WHERE c.comment_id = ? AND c.task_id = ? AND c.user_id = ?';

        let paramsSelectComment = [id, task_id, user_id];

        const commentData = await conn.query(sqlSelect, paramsSelectComment);

        if (!commentData[0] || commentData[0].length === 0) {
            return res.status(400).json({ error: 'ไม่สามารถอัพเดต comment ได้' });
        }

        let sql = 'UPDATE comments SET comment = ?, updated_at = NOW()';

        let params = [comment];

        // if (user_id) {
        //     sql += ', user_id = ?';
        //     params.push(user_id);
        // }

        sql += ' WHERE comment_id = ?';
        params.push(id);

        const [result] = await conn.query(sql, params);

        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json({
            message: 'Comment updated successfully',
            comment_id: id,
            updated_comment: {
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
        const { id } = req.params;

        if (!id || isNaN(id) || id <= 0) {
            return res.status(400).json({ error: 'Invalid comment ID provided' });
        }

        const conn = await connectDB();
        const sql = 'DELETE FROM comments WHERE comment_id = ?';
        const [result] = await conn.query(sql, [id]);

        await conn.end();

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json({
            message: 'Comment deleted successfully',
            comment_id: id
        });

    } catch (error) {
        console.log(error);
        res.status(500).send('Server Error');
    }
};




const mysql = require('mysql2/promise');

const connectDB = async () => {
    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'todo_db',
        port: 3306
    });
};

module.exports = { connectDB };
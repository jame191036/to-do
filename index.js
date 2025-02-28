const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const morgan = require('morgan');
// const { connectDB } = require('../Config/config');

const { readdirSync } = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

// connenctDB();
readdirSync('./Routes').map((r) => app.use('/api', require('./Routes/' + r)));

const port = 3000;

let users = [];
let counter = 1;

// let conn = null;

// const inntMySql = async () => {
//     conn = await mysql.createConnection({
//         host: 'localhost',
//         user: 'root',
//         password: 'root',
//         database: 'todo_db',
//         port: 3306
//     });
// }

const validateData = (userData) => {
    let errors = []
    if (!userData.firstname) {
        errors.push('กรุณาใส่ชื่อจริง')
    }
    if (!userData.lastname) {
        errors.push('กรุณาใส่นามสกุล')
    }
    if (!userData.age) {
        errors.push('กรุณาใส่อายุ')
    }
    if (!userData.description) {
        errors.push('กรุณาใส่คำอธิบาย')
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกความสนใจอย่างน้อย 1 อย่าง')
    }
    return errors
}

// app.get('/testdb-new', async (req, res) => {
//     try {

//         // const errors = await validateData(userData);
//         // if (errors.length > 0) {
//         //     throw {
//         //         message: 'error',
//         //         errors: errors
//         //     }
//         // }

//         const results = await conn.query('SELECT * FROM users');
//         res.json(results[0]);
//     } catch (error) {
//         // console.error('Error fetching users:', error.message)
//         // res.status(500).json({ error: 'Error fetching users' })
//         res.status(500).json({
//             message: 'Error',
//             errorMessage: error.message
//         })
//     }
// });

app.get('/users', (req, res) => {
    // let user = {
    //     firstname: 'ทดสอบ',
    //     lastname: 'นามสกุล',
    //     age: 24,
    //     id: 0
    // };
    res.send(users);
});

app.post('/user', (req, res) => {
    const data = req.body
    data.id = counter;
    counter += 1;

    const newUser = {
        firstname: data.firstname,
        lastname: data.lastname,
        age: data.age,
        id: data.id
    }
    //
    users.push(newUser)

    // Server ตอบกลับมาว่าเพิ่มแล้วเรียบร้อย
    res.status(201).json({ message: 'User created successfully', user: newUser })
});

app.put('/user/:id', (req, res) => {
    let id = req.params.id;
    let updateUser = req.body;

    let selectIndex = users.findIndex(user => user.id == id);

    users[selectIndex].firstname = updateUser.firstname || users[selectIndex].firstname;
    users[selectIndex].lastname = updateUser.lastname || sers[selectIndex].lastname;

    res.json({
        message: "update user conplete",
        data: {
            user: updateUser,
            indexUpdate: selectIndex

        }
    })

    res.send(selectIndex.toString());
});

app.delete('/user/:id', (req, res) => {
    let id = req.params.id;

    let selectIndex = users.findIndex(user => user.id == id);

    users.splice(selectIndex, 1)

    res.json({
        message: 'delect complete',
        userid: id
    })
});

app.listen(port, async () => {
    // await inntMySql();
    console.log('http server run at', port);
});

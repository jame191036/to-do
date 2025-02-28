const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const cors = require('cors');
const morgan = require('morgan');
const { readdirSync } = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('dev'));

readdirSync('./Routes').map((r) => app.use('/api', require('./Routes/' + r)));

const port = 3000;

app.listen(port, async () => {
    console.log('http server run at', port);
});

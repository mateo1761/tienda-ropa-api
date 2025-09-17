require('dotenv').config();
const mysql = require('mysql2');

let connection;

function connect() {

    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        multipleStatements: false
    });

    connection.connect((err) => {
        if (err) {
            console.error('Error conectando a MySql:', err.message);
            process.exit(1);
        }
        console.log(`Conectando a MySql -> ${process.env.DB_NAME}`);
    });

    connection.on('error', (err) => {
        console.error('MySQL error:', err.code, err.message);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('♻️  Reconectando a MySQL...');
            connect();
        } else {
            throw err;
        }
    });
}
connect();

const query = (sql, params = []) => 
    new Promise((resolve, reject) => {
        connection.query(sql, params, (err, rows) => {
            if (err) return reject(err);
            resolve(rows);
        });
    });

module.exports = { query }
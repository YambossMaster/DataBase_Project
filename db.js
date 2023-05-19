
var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'kirito',
    password: 'starburstStream',
    database: 'final_project'
})
module.exports = connection;
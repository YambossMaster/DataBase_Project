
var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: '192.168.0.22',
    user: 'kirito',
    password: 'starburstStream',
    database: 'final_project'
})
module.exports = connection;

var mysql = require('mysql2');
var connection = mysql.createConnection({
    host: '192.168.56.1',
    user: 'kirito',
    password: 'starburstStream',
    database: 'final_project'
})
module.exports = connection;

// connection.connect();

// let musicBlock1 = document.getElementById("mB1");
// let songTitle = document.getElementById("songTitle");
// let singerName = document.getElementById("singerName");
// songTitle.innerText = "haha";


// connection.query('SELECT * FROM emploee', function(error, results, fields){
//     if(error) throw error;
//     // songTitle.innerHTML = results[0].name;
//     // singerName.innerHTML = results[0].salary;
//     for(let i = 0; i < results.length; ++i){
//         // console.log(results[i].name, results[i].emp_id, results[i].salary);
//         // document.write("<h3>" + results[0].name + "</h3>");
//         // document.write("<h3>" + results[0].emp_id + "</h3>");
//         // document.write("<h3>" + results[0].salary + "</h3><br>");
//     }
// });
// connection.end();
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database : 'jwtpractice'
})

connection.connect();

// connection.connect((err) => {
//     var server = app.listen(port, 'localhost', function() {
//         var host = server.address().address
//         var port = server.address().port
//         console.log('Example app listening at http://%s:%s', host, port);
//     });
//     // create();
// });

// var create = () => {
//     var sql = 'CREATE TABLE userinfo2 (id INT AUTO_INCREMENT, name VARCHAR(255), phone VARCHAR(13) UNIQUE, email VARCHAR(255),  password VARCHAR(255), PRIMARY KEY (id))';
//     connection.query(sql, (err, result) => {
//         if(err) throw err;
//         console.log('Table created');
//     })
// }
module.exports = connection;
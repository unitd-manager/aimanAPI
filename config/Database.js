var mysql = require('mysql');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'aimaan',
    password: 'WES5WD6t84CG4rme',
    database: 'aimaan'
});
db.connect(); 
module.exports = db;
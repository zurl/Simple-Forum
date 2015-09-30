/**
 * Created by furry on 9/28/2015.
 */
var express = require('express');
var app = express();
var mysql      = require('mysql');
function getMysqlConnection(){
    var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'furrydb'
    });
    return connection;
}
//predefine end

app.use(express.static('public'));
app.post('/login',function(req,res){
    var con = getMysqlConnection();
    con.connect();
    con.query('SELECT * FROM `user` WHERE `name` = "'+req.body.username+'" AND `password` = "'+req.body.password+'";', function(err, rows, fields) {
        if (err){

        }else{

        }
        console.log('The solution is: ', rows[0].name);

    });
    con.end();
})
var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});


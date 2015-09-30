/**
 * Created by furry on 9/28/2015.
 */

//import

var express = require('express');
var app = express();
var mysql  = require('mysql');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var cookieParser = require('cookie-parser');

//var ejs = require('ejs');

//settings

//app.engine('.html', require('ejs').__express);
//app.set('view engine', 'html');
app.set('trust proxy', 1);

app.use(cookieParser());
app.use(multer()); // for parsing multipart/form-data
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'));// for static route
app.use(session({
    secret: 'WODESHIYOUSHILAIZIH',
    key: 'uid',
    cookie: { secure: false , maxAge: 8000000 },
    resave: false,
    saveUninitialized: true
}))
app.use(function (req, res, next) {
    // interceptors

    console.log(req.session);


   // res.locals.username = req.session.username;
    console.log(req.session.username);
    var url = req.originalUrl;
    if (url != "/login" && !req.session.username) {
        return res.redirect("/login.html");
    }
    next();
});
//define

function getMysqlConnection(){
    return mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'furrydb'
    });
}
function isLogin(req){
    if (req.session.username) return true;
    else return false;

}
function isAdmin(req){
    if (req.session.lv == 2)return true;
    else return false;
}


//routers
/*
app.get('/login', function(req, res) {
    res.render('login', { title: 'Express' });
});
app.get('/admin', function(req, res) {
    if(isLogin(req)){
        res.render('error_lg', { title: 'Express' });
    }else{
        if(isAdmin(req)){
            res.render('admin', { title: 'Express' });
        }else{
            res.render('error_lv', { title: 'Express' });
        }
    }

});
app.get('/home', function(req, res) {
    if(isLogin(req)){
        res.render('error_lg', { title: 'Express' });
    }else{
        res.render('home', { title: 'Express' });
    }

});
*/
app.post('/login',function(req,res){
    var con = getMysqlConnection();
    con.connect();
    con.query("use webtest;", function(err, rows, fields) {
        if (err){
            res.end("ERR");
        }
    });
    var constr = 'SELECT * FROM `user` WHERE `name` = "'+req.body.username +'" AND `password` = "'+req.body.password+'";';
    con.query(constr, function(err, rows, fields) {
        if (err){
            // console.log('err');
            res.end("ERR");
        }else{
            if(typeof(rows[0]) != "undefined"){
                //console.log('ok',rows[0].name);

                req.session.username = req.body.username.toString();
                req.session.lv = rows[0].lv.toString();
                console.log(req.session.username);
                res.end("OK");
            }else{
                // console.log('err');
                res.end("FAIL");
            }

        }
    });
    con.end();
});
app.post('/register',function(req,res){
    var con = getMysqlConnection();
    con.connect();
    con.query("use webtest;", function(err, rows, fields) {
        if (err){
            res.end("ERR");
        }
    });
    var constr = 'INSERT INTO `user` (`name`,`password`,`lv`) VALUES ( "' + req.body.username + '","'+ req.body.password +  '","1");';
    con.query(constr, function(err, rows, fields) {
        if (err){
            res.end("ERR");
        }else{
            res.end("OK");

        }
    });
    con.end();
});
//main

var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});




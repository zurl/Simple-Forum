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
var path = require('path');

var ejs = require('ejs');

//settings

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('trust proxy', 1);

app.use(cookieParser());
app.use(multer()); // for parsing multipart/form-data
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'WODESHIYOUSHILAIZIH',
    key: 'uid',
    cookie: { secure: false , maxAge: 8000000 },
    resave: false,
    saveUninitialized: true
}))
app.get('/', function(req, res) {
    res.render('index', { title: 'Express',dt : "hello" });
});

//define

function getMysqlConnection(){
    var con = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : 'furrydb'
    });
    con.connect();
    con.query("use webtest;", function(err,rows,fields) {
        if (err){
            res.end("ERR");
        }
    });
    return con;
}
function isLogin(req){
    if (req.session.username) return true;
    else return false;

}
function isAdmin(req,lv){
    /*
        user : 0
        admin_base : 1
        admin_content : 2
        admin_user : 4
     */
    return  req.session.lv & lv;
}
var navlist_admin = [
    {
        "name" : "home",
        "page" : "/admin"
    },
    {
        "name" : "content",
        "page" : "/admin"
    },{
        "name" : "home",
        "page" : "/admin"
    }
];


//routers

app.get('/admin',function(req,res){
    if(isAdmin(req,1)){
        res.render('admin', { title: 'ADMIN',dt : "hello" });
    }else{
        res.redirect("/error_lv.html");
    }
});
app.get('/admin_user',function(req,res){
    if(isAdmin(req,2)){
        var con = getMysqlConnection();

        var constr = "SELECT * FROM `user`;";
        con.query(constr, function(err, rows, fields) {
            console.log(JSON.stringify(rows));
            res.render('admin_user', { title: 'ADMINUSER',data : JSON.stringify(rows) });
        });
    }else{
        res.redirect("/error_lv.html");
    }
});
app.get('/admin_article',function(req,res){
    if(isAdmin(req,1)){
        var con = getMysqlConnection();
        var constr = "SELECT * FROM `article`;";
        con.query(constr, function(err, rows, fields) {

            res.render('admin_user', { title: 'ADMINARTICLE',data : rows });
        });
    }else{
        res.redirect("/error_lv.html");
    }
});
app.get('/error_lv',function(req,res) {
    res.render('error_lv', { title: 'ADMIN',dt : "hello" });
});
app.post('/login',function(req,res){
    var con = getMysqlConnection();
    var condat = [req.body.username,req.body.password];
    var constr = 'SELECT * FROM `user` WHERE `name` = ? AND `password` = ? ;';
    con.query(constr,condat,function(err,rows,fields) {
        if (err){
            // console.log('err');
            res.end("ERR");
        }else{
            if(rows[0]){
                console.log('ok',rows[0]);
                req.session.username = req.body.username;
                req.session.lv = rows[0].lv;
                console.log(req.session.username);
                res.render('index', { title: 'Essss',dt : rows[0] });
            }else{
                 console.log('fail');
                 res.send({"rtype":"danger","rdata":"FAILED : username and password error"});
                 res.end();
            }

        }
    });
    con.end();
});
app.post('/register',function(req,res){
    var con = getMysqlConnection();
    var condat = [req.body.username,req.body.password];
    var constr = 'INSERT INTO `user` (`name`,`password`,`lv`) VALUES ( ?,?,"0");';
    con.query(constr, condat, function(err, rows, fields) {
        if (err){
            res.end("ERR");
        }else{
            res.end("OK");

        }
    });
    con.end();
});
app.post('/admin_user',function(req,res){
    //select
    //new
    //update
    //delete
    if(isAdmin(req,4)){
        var ope = req.body.ope;
        if(ope == 1){
            //new user
            var condat = [req.body.username,req.body.password,req.body.lv];
            var constr = 'INSERT INTO `user` (`name`,`password`,`lv`) VALUES (?,?,?);';
            con.query(constr, condat, function(err, rows, fields) {
                if (err) {
                    res.end("ERR");
                } else {
                    res.json("OK");
                }
            });
        }
    }else{
        res.end("ERR");
    }
})
//main
app.use(function (req, res, next) {
    // interceptors

    //console.log(req.session);


    // res.locals.username = req.session.username;
    var url = req.originalUrl;
    if (url != "/login" && !req.session.username) {
        return res.redirect("/login");
    }

    next();
});
var server = app.listen(80, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});




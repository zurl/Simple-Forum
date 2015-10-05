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
var c_admin_base = 1;
var c_admin_content = 2;
var c_admin_user = 4;
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
}));
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
function isAdmin(req,lv){
    /*
        user : 0
        admin_base : 1
        admin_content : 2
        admin_user : 4
     */
    return  req.session.lv & lv;
}


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
            res.render('admin_user', { title: 'ADMINUSER',data : JSON.stringify(rows) });
        });
    }else{
        res.redirect("/error_lv.html");
    }
});
app.get('/admin_article',function(req,res){
    if(isAdmin(req,1)){
        var con = getMysqlConnection();
        var constr = "SELECT DATE_FORMAT(`updatetime`,'%Y-%m-%d %H-%i-%S') AS 'updatetime' ,DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`brief`,`content`,`title`,`author`,`id` FROM `article`;";
        con.query(constr, function(err, rows, fields) {
            res.render('admin_article', { title: 'ADMINARTICLE',data :JSON.stringify(rows)  });
        });
    }else{
        res.redirect("/error_lv.html");
    }
});
app.get('/admin_article_view',function(req,res){
    if(isAdmin(req,1)){
        var con = getMysqlConnection();
        var condat = [req.query.aid];
        var constr = "SELECT DATE_FORMAT(`updatetime`,'%Y-%m-%d %H-%i-%S') AS 'updatetime' ,DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`content`,`title`,`author`,`id` WHERE `id` = ? FROM `article` ;";
        con.query(constr, condat, function(err, rows, fields) {
            res.render('admin_article_view', { title: 'ADMINARTICLEVIEW',data :JSON.stringify(rows)  });
        });
    }else{
        res.redirect("/error_lv.html");
    }
});
app.get('/admin_article_insert',function(req,res){
    if(isAdmin(req,1)){
        res.render('admin_article_insert', { title: 'ADMINARTICLEINSERT'  });
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
    var constr = 'SELECT * FROM `user` WHERE `username` = ? AND `password` = ? ;';
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
                 res.send({"rtype":"danger","rdata":"FAILED : Username or password is wrong"});
                 res.end();
            }

        }
    });
    con.end();
});
app.post('/register',function(req,res){
    var con = getMysqlConnection();
    var condat = [req.body.username,req.body.password];
    var constr = 'INSERT INTO `user` (`username`,`password`,`lv`) VALUES ( ?,?,"0");';
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
    var condat,constr;
    if(isAdmin(req,c_admin_user)){
        var con = getMysqlConnection();
        var ope = req.body.ope;
        if(ope == 'INSERT') {
            condat = [req.body.username,req.body.password,req.body.lv];
            constr = 'INSERT INTO `user` (`username`,`password`,`lv`) VALUES (?,?,?);';
        }else if(ope == 'UPDATE') {
            condat = [req.body.password,req.body.lv,req.body.username];
            constr = 'UPDATE `user` SET `password` = ? , `lv` = ? WHERE `username` = ?;';
        }
        else if(ope == 'DELETE') {
            condat = [req.body.username];
            constr = 'DELETE FROM `user` WHERE `username` = ?;';
        }
        con.query(constr, condat, function(err, result) {
            if (err){
                if(err.code == 'ER_DUP_ENTRY'){
                    res.send({"rtype":"danger","rdata":"ERROR : The username has been used."});
                }else{
                    res.send({"rtype":"danger","rdata":err.code});
                }
                res.end();
            } else {
                res.send({"rtype":"success","rdata":"SUCCESS : Executed successfully."});
                res.end();
            }
        });
    }else{
        res.end("ERR");
    }
});
app.post('/admin_article',function(req,res){
    var condat,constr;
    if(isAdmin(req,c_admin_content)){
        var con = getMysqlConnection();
        var ope = req.body.ope;
        if(ope == 'INSERT') {
            condat = [req.body.title,req.body.brief,req.body.content,req.session.username];
            constr = 'INSERT INTO `article` (`title`,`brief`,`content`,`author`,`createtime`,`updatetime`) VALUES (?,?,?,?,now(),now());';
        }else if(ope == 'UPDATE') {
            condat = [req.body.title,req.body.brief,req.body.content,req.body.aid];
            constr = 'UPDATE `article` SET `title` = ? , `brief` = ? , `content` = ? ,`updatetime` = now() WHERE `id` = ?;';
        }
        else if(ope == 'DELETE') {
            condat = [req.body.aid];
            constr = 'DELETE FROM `article` WHERE `id` = ?;';
        }
        con.query(constr, condat, function(err, result) {
            if (err){
                if(err.code == 'ER_DUP_ENTRY'){
                    res.send({"rtype":"danger","rdata":"ERROR : The username has been used."});
                }else{
                    res.send({"rtype":"danger","rdata":err.code});
                }
                res.end();
            } else {
                res.send({"rtype":"success","rdata":"SUCCESS : Executed successfully."});
                res.end();
            }
        });
    }else{
        res.end("ERR");
    }
});
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




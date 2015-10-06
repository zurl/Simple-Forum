/**
 * Created by furry on 9/28/2015.
 */

//import

var fs = require('fs');
var express = require('express');
var app = express();
var mysql  = require('mysql');
var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var query = require('querystring');

var ejs = require('ejs');
var c_user = 0;
var c_admin_base = 1;
var c_admin_insert_article = 2;
var c_admin_manage_article = 4;
var c_admin_super = 8;
var dbpassword = "";
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
app.use(function (req, res, next) {
    res.locals.a = 0;
    if(isLogin(req)){
        res.locals.l = 1;
        res.locals.username = req.session.username;
        if(isAdmin(req,c_admin_base)){
            res.locals.a = 1;
        }
    }else{

        res.locals.l = 0;
    }
    next();
});
//define

function getMysqlConnection(){
    var con = mysql.createConnection({
        host     : 'localhost',
        user     : 'root',
        password : dbpassword
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
    return req.session && req.session.username;
}
function isAdmin(req,lv){
    /*
        user : 0
        admin_base : 1
        admin_insert_article : 2
        admin_insert_activity : 4
        admin_insert_pic : 8
        admin_manage_article : 16
        admin_manage_activity : 32
        admin_manage_pic :64
        admin_super : 128
     */
    return  req.session.lv & lv;
}


//routers

app.get('/admin',function(req,res){
    if(isAdmin(req,c_admin_base)){
        res.render('admin', { act:"admin", act2 : "a",title: 'ADMIN',dt : "hello" });
    }else{
        res.redirect("/error_lv");
    }
});
app.get('/admin_user',function(req,res){
    if(isAdmin(req,c_admin_super)){
        var con = getMysqlConnection();
        var constr = "SELECT * FROM `user`;";
        con.query(constr, function(err, rows, fields) {
            res.render('admin_user', { act:"admin",act2 : "au",  title: 'ADMINUSER',data : JSON.stringify(rows) });
        });
    }else{
        res.redirect("/error_lv");
    }
});
app.get('/admin_article',function(req,res){
    if(isAdmin(req,c_admin_manage_article)){
        var con = getMysqlConnection();
        var constr = "SELECT DATE_FORMAT(`updatetime`,'%Y-%m-%d %H:%i:%S') AS 'updatetime' ,DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`type`,`top`,`brief`,`content`,`title`,`author`,`id` FROM `article`;";
        con.query(constr, function(err, rows, fields) {
            res.render('admin_article', {  act:"admin", act2 : "aa",title: 'ADMINARTICLE',data :JSON.stringify(rows)  });
        });
    }else{
        res.redirect("/error_lv");
    }
});
app.get('/admin_article_view',function(req,res){
    if(isAdmin(req,c_admin_manage_article)){
        var con = getMysqlConnection();
        var condat = [req.query.aid];
        var constr = "SELECT DATE_FORMAT(`updatetime`,'%Y-%m-%d %H:%i:%S') AS 'updatetime' ,DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`type`,`brief`,`content`,`title`,`author`,`id` FROM `article` WHERE `id` = ? ;";
        con.query(constr, condat, function(err, rows, fields) {
            res.render('admin_article_view', { act:"admin",act2 : "aav",title: 'ADMINARTICLEVIEW',data :JSON.stringify(rows)  });
        });
    }else{
        res.redirect("/error_lv");
    }
});
app.get('/admin_article_insert',function(req,res){
    if(isAdmin(req,c_admin_insert_article)){
        var con = getMysqlConnection();
        var constr = "SELECT * FROM `options` WHERE `name` = 'articletype' ;";

        con.query(constr, function(err, rows, fields) {
            console.log(rows);
            res.render('admin_article_insert', { act:"admin",act2 : "aai", data : JSON.stringify(rows),title: 'ADMINARTICLEINSERT'  });});

    }else{
        res.redirect("/error_lv");
    }
});
app.get('/error_lv',function(req,res) {
    res.render('error_lv', {act:"home", title: 'ADMIN',dt : "hello" });
});
app.get('/login',function(req,res) {
    if(isLogin(req)){
        res.redirect('/');
    }else{
        res.render('login', {act:"home",title: 'login'});
    }
});
app.get('/logout',function(req,res) {
    req.session.destroy();
    res.redirect("/");
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
                res.send({"rtype":"success","rdata":"SUCCESS : Login successfully"});
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
    if(isAdmin(req,c_admin_super)){
        var con = getMysqlConnection();
        var ope = req.body.ope;
        if(ope == 'INSERT') {
            condat = [req.body.username,req.body.password,req.body.lv];
            constr = 'INSERT INTO `user` (`username`,`password`,`lv`) VALUES (?,?,?);';
        }else if(ope == 'UPDATE') {
            condat = [req.body.password,req.body.lv,req.body.uid];
            constr = 'UPDATE `user` SET `password` = ? , `lv` = ? WHERE `id` = ?;';
        }
        else if(ope == 'DELETE') {
            condat = [req.body.uid];
            constr = 'DELETE FROM `user` WHERE `id` = ?;';
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
    var con = getMysqlConnection();
    var ope = req.body.ope;
    if(ope == 'INSERT' && isAdmin(req,c_admin_insert_article)) {
        condat = [req.body.title,req.body.atype,req.body.brief,req.body.content,req.session.username];
        constr = 'INSERT INTO `article` (`title`,`type`,`brief`,`content`,`author`,`createtime`,`updatetime`) VALUES (?,?,?,?,?,now(),now());';
    }else if(ope == 'UPDATE' && isAdmin(req,c_admin_manage_article)) {
        condat = [req.body.atype,req.body.title,req.body.brief,req.body.content,req.body.aid];
        constr = 'UPDATE `article` SET `type` = ? `title` = ? , `brief` = ? , `content` = ? ,`updatetime` = now() WHERE `id` = ?;';
    }else if(ope == 'TOP' && isAdmin(req,c_admin_manage_article)) {
        condat = [req.body.top,req.body.aid];
        constr = 'UPDATE `article` SET `top` = ? WHERE `id` = ?;';
    }else if(ope == 'DELETE' && isAdmin(req,c_admin_manage_article)) {
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
});

//public
app.get('/', function(req, res) {
    var con = getMysqlConnection();
    var constr = "SELECT DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`type`,`brief`,`title`,`author`,`id` FROM `article` WHERE `TOP` = 1;";
    con.query(constr, function(err, rows, fields) {
        res.render('index', { act:"home",title: 'INDEX',data :JSON.stringify(rows)  });
    });
});
app.get('/article',function(req,res) {
    var con = getMysqlConnection();
    var constr = "SELECT DATE_FORMAT(`updatetime`,'%Y-%m-%d %H:%i:%S') AS 'updatetime' ,DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`type`,`brief`,`title`,`author`,`id` FROM `article` ;";
    con.query(constr, function(err, rows, fields) {
        res.render('article', { act:"article",title: 'ARTICLE',data :JSON.stringify(rows)  });
    });
});
//public
app.get('/article_view',function(req,res) {
    var con = getMysqlConnection();
    var condat = [req.query.aid];
    var constr = "SELECT DATE_FORMAT(`updatetime`,'%Y-%m-%d %H:%i:%S') AS 'updatetime' ,DATE_FORMAT(`createtime`,'%Y-%m-%d %H:%i:%S') AS 'createtime' ,`type`,`brief`,`content`,`title`,`author`,`id` FROM `article` WHERE `id` = ? ;";
    con.query(constr, condat, function(err, rows, fields) {
        res.render('article_view', {act:"article", title: 'ARTICLEVIEW',data :JSON.stringify(rows)  });
    });
});
//main
app.get('/info', function(req, res) {
    res.render('info', { act:"info",title: 'Test Website - Info Page' });
});
app.get('/center', function(req, res) {
    res.render('center', { act:"info",title: 'Test Website - Personal Center' });
});

var server = app.listen(80, function () {
    fs.readFile('config.json',function(err,data) {
        var _json = JSON.parse(data);
        dbpassword = _json.password;
    })
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});




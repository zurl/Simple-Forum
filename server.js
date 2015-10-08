/**
 * Created by furry on 9/28/2015.
 * 
 */

//import

var fs = require('fs');
var express = require('express');
var app = express();
var mysql  = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var address = require('address');
var ejs = require('ejs');

var c_user = 0;
var c_admin_base = 1;
var c_admin_insert_article = 2;
var c_admin_manage_article = 4;
var c_admin_super = 8;
var listen_port = 80;
var dbjson = {};
var typejson = {};

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.set('trust proxy', 1);

app.use(cookieParser());
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
    var con = mysql.createConnection(dbjson);
    con.connect();
    con.query('use webtest;', function(err,rows,fields) {
        if (err){
            res.end('ERR');
        }
    });
    return con;
}
function isLogin(req){
    return req.session && req.session.username;
}
function isAdmin(req,lv){
    return  req.session.lv & lv;
}


//routers

app.get('/admin',function(req,res){
    if(isAdmin(req,c_admin_base)){
        res.render('admin', { act:'admin', act2 : 'a',title: 'Test Website - Admin system',dt : 'hello' });
    }else{
        res.redirect('/error_lv');
    }
});
app.get('/admin_user',function(req,res){
    if(isAdmin(req,c_admin_super)){
        var con = getMysqlConnection();
        var constr = 'SELECT * FROM `user`;';
        con.query(constr, function(err, rows, fields) {
            res.render('admin_user', { act:'admin',act2 : 'au',  title: 'Test Website - Admin system',data : JSON.stringify(rows) });
        });
    }else{
        res.redirect('/error_lv');
    }
});
app.get('/admin_article',function(req,res){
    if(isAdmin(req,c_admin_manage_article)){
        var con = getMysqlConnection();
        var constr = 'SELECT DATE_FORMAT(`updatetime`,\'%Y-%m-%d %H:%i:%S\') AS \'updatetime\' ,DATE_FORMAT(`createtime`,\'%Y-%m-%d %H:%i:%S\') AS \'createtime\' ,`atype`,`top`,`brief`,`content`,`title`,`author`,`id` FROM `article`;';
        con.query(constr, function(err, rows, fields) {
            res.render('admin_article', {  act:'admin', act2 : 'aa',title: 'Test Website - Admin system',data :JSON.stringify(rows)  });
        });
    }else{
        res.redirect('/error_lv');
    }
});
app.get('/admin_article_view',function(req,res){
    if(isAdmin(req,c_admin_manage_article)){
        var con = getMysqlConnection();
        var condat = [req.query.aid];
        var constr = 'SELECT DATE_FORMAT(`updatetime`,\'%Y-%m-%d %H:%i:%S\') AS \'updatetime\' ,DATE_FORMAT(`createtime`,\'%Y-%m-%d %H:%i:%S\') AS \'createtime\' ,`atype`,`brief`,`content`,`title`,`author`,`id` FROM `article` WHERE `id` = ? ;';
        con.query(constr, condat, function(err, rows, fields) {
            res.render('admin_article_view', { act:'admin',act2 : 'aav', tydata :JSON.stringify(typejson),title: 'Test Website - Admin system',data :JSON.stringify(rows)  });
        });
    }else{
        res.redirect('/error_lv');
    }
});
app.get('/admin_article_insert',function(req,res){
    if(isAdmin(req,c_admin_insert_article)){
        res.render('admin_article_insert', { act:'admin',act2 : 'aai', tydata : JSON.stringify(typejson),title: 'Test Website - Admin system'  });
    }else{
        res.redirect('/error_lv');
    }
});
app.get('/error_lv',function(req,res) {
    res.render('error_lv', {act:'home', title: 'Test Website - Admin system',dt : 'hello' });
});
app.get('/login',function(req,res) {
    if(isLogin(req)){
        res.redirect('/');
    }else{
        res.render('login', {act:'home',title: 'Test Website - Login page'});
    }
});
app.get('/logout',function(req,res) {
    req.session.destroy();
    res.redirect('/');
});
app.post('/login',function(req,res){
    var con = getMysqlConnection();
    var condat = [req.body.username,req.body.password];
    var constr = 'SELECT * FROM `user` WHERE `username` = ? AND `password` = ? ;';
    con.query(constr,condat,function(err,rows,fields) {
        if (err){
            res.end('ERR');
        }else{
            if(rows[0]){
                req.session.username = req.body.username;
                req.session.lv = rows[0].lv;
                res.send({'rtype':'success','rdata':'SUCCESS : Login successfully'});
            }else{
                 res.send({'rtype':'danger','rdata':'FAILED : Username or password is wrong'});
                 res.end();
            }

        }
    });
    con.end();
});
app.post('/register',function(req,res){
    var con = getMysqlConnection();
    var condat = [req.body.username,req.body.password];
    var constr = 'INSERT INTO `user` (`username`,`password`,`lv`) VALUES ( ?,?,\'0\');';
    con.query(constr, condat, function(err, rows, fields) {
        if (err){
            res.end('ERR');
        }else{
            res.end('OK');

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
                    res.send({'rtype':'danger','rdata':'ERROR : The username has been used.'});
                }else{
                    res.send({'rtype':'danger','rdata':err.code});
                }
                res.end();
            } else {
                res.send({'rtype':'success','rdata':'SUCCESS : Executed successfully.'});
                res.end();
            }
        });
    }else{
        res.end('ERR');
    }
});
app.post('/admin_article',function(req,res){
    var condat,constr;
    var con = getMysqlConnection();
    var ope = req.body.ope;
    if(ope == 'INSERT' && isAdmin(req,c_admin_insert_article)) {
        condat = [req.body.title,req.body.atype,req.body.brief,req.body.content,req.session.username];
        constr = 'INSERT INTO `article` (`title`,`atype`,`brief`,`content`,`author`,`createtime`,`updatetime`) VALUES (?,?,?,?,?,now(),now());';
    }else if(ope == 'UPDATE' && isAdmin(req,c_admin_manage_article)) {
        condat = [req.body.atype,req.body.title,req.body.brief,req.body.content,req.body.aid];
        constr = 'UPDATE `article` SET `atype` = ? ,`title` = ? , `brief` = ? , `content` = ? ,`updatetime` = now() WHERE `id` = ?;';
    }else if(ope == 'TOP' && isAdmin(req,c_admin_manage_article)) {
        condat = [req.body.top,req.body.aid];
        constr = 'UPDATE `article` SET `top` = ? WHERE `id` = ?;';
    }else if(ope == 'DELETE' && isAdmin(req,c_admin_manage_article)) {
        condat = [req.body.aid];
        constr = 'DELETE FROM `article` WHERE `id` = ?;';
    }
    con.query(constr, condat, function(err, result) {
        if (err){
            res.send({'rtype':'danger','rdata':err.code});
            res.end();
        } else {
            res.send({'rtype':'success','rdata':'SUCCESS : Executed successfully.'});
            res.end();
        }
    });
});

//public
app.get('/', function(req, res) {
    var con = getMysqlConnection();
    var constr = 'SELECT DATE_FORMAT(`createtime`,\'%Y-%m-%d %H:%i:%S\') AS \'createtime\' ,`atype`,`brief`,`title`,`author`,`id` FROM `article` WHERE `TOP` = 1;';
    con.query(constr, function(err, rows, fields) {
        res.render('index', { act:'home',title: 'Test Website',data :JSON.stringify(rows)  });
    });
});
app.get('/article',function(req,res) {
    var con = getMysqlConnection();
    var qtype;
    if(!req.query.atype)req.query.atype = typejson.typedata.split(',')[0];
    var condat = [req.query.atype];
    var constr = 'SELECT DATE_FORMAT(`updatetime`,\'%Y-%m-%d %H:%i:%S\') AS \'updatetime\' ,DATE_FORMAT(`createtime`,\'%Y-%m-%d %H:%i:%S\') AS \'createtime\' ,`atype`,`brief`,`title`,`author`,`id` FROM `article` WHERE `atype` = ?;';
    con.query(constr,condat, function(err, rows, fields) {
        res.render('article', { atype:req.query.atype,act:'article',title: 'Test Website - Article page',data :JSON.stringify(rows) ,tydata:JSON.stringify(typejson) });
    });
});
//public
app.get('/article_view',function(req,res) {
    var con = getMysqlConnection();
    var condat = [req.query.aid];
    var constr = 'SELECT DATE_FORMAT(`updatetime`,\'%Y-%m-%d %H:%i:%S\') AS \'updatetime\' ,DATE_FORMAT(`createtime`,\'%Y-%m-%d %H:%i:%S\') AS \'createtime\' ,`atype`,`brief`,`content`,`title`,`author`,`id` FROM `article` WHERE `id` = ? ;';
    con.query(constr, condat, function(err, rows, fields) {
        res.render('article_view', {atype:rows[0].atype,act:'article', title: 'Test Website - Article view',data :JSON.stringify(rows) ,tydata:JSON.stringify(typejson)  });
    });
});
//main
app.get('/info', function(req, res) {
    res.render('info', { act:'info',title: 'Test Website - Info Page' });
});
app.get('/center', function(req, res) {
    res.render('center', { act:'info',title: 'Test Website - Personal Center' });
});

fs.readFile('config.json',function(err,data) {
    var _json = JSON.parse(data);
    dbjson = {
        host : _json.db_host,
        user : _json.db_user,
        password : _json.db_password
    };
    typejson = {
        typedata :  _json.article_type
    };
    listen_port = _json.listen_port;
});

var server = app.listen(listen_port, function () {
    console.log('TestWebsite server listening on port '+ listen_port);
});




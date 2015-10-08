a normal homework of furry >_<

###################################
About deployment

1.This project use Node.js + mysql as server , please ensure that you have installed them.

2.Create a new database in mysql for this website , and create tables as following.

#Mysql command

#This table is used to store user information.
CREATE TABLE user
(
id int NOT NULL PRIMARY KEY AUTO_INCREMENT,
username varchar(50) NOT NULL UNIQUE ,
password varchar(50) NOT NULL,
lv int NOT NULL
);

#This table is used to store article information.
CREATE TABLE article
(
id int PRIMARY KEY NOT NULL AUTO_INCREMENT,
author varchar(50) NOT NULL,
title text NOT NULL,
brief text ,
onindex tinyint NOT NULL,
createtime DATETIME NOT NULL,
updatetime DATETIME NOT NULL,
content text,
type text
);

3.Create an user as administrator for you to login the background,set `lv` = 15 to guarantee to get all the authorization.

#Mysql command
INSERT INTO user (`username`,`password`,`lv`)VALUES('test','test','15');

4.In this project, the authorization management is arranged as following.Once you want to get authorization more than one , you just need to add them up.

var c_user = 0; //normal user
var c_admin_base = 1; // access to background
var c_admin_insert_article = 2;  // insert article
var c_admin_manage_article = 4;  // delete , change , top article (NOT INCLUDE insert)
var c_admin_super = 8;  // user management

5.You also should to write config.json , which is settings file for the website. we need FIVE attributes.
"db_host" //the address of mysql server
"db_user" : //the username of mysql
"db_password" : //the password of mysql
"listen_port" : //the port of http listen , the default value is 80
"article_type" : //the types of article , which should be split by ','

we also provide the config.json.default as template , you can refer to it.

6.The project need some Node.js dependencies , use "npm install" command to install them.
(If you can't automatically install all the dependencies , you can find the name of them in "server.js" and install them manually.)

7.render "node server.js".




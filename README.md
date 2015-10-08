About project
=============================

This is a test website, which is created for the National Day holiday homework of furry.<br /\> 

I have used the `node` + `express` + `ejs` + `mysql` for back end, and `bootstrap` for front end.<br /\> 
(I have plan to learn ORM and Angular in the future.)<br /\> 

Limited by furry's low web developing skills, this website is so simple and full of mistakes.<br /\> 
Welcome everyone to write issue about it on gitlib.<br /\> 

About deployment
=============================

### 1.This project use `Node.js` + `mysql` as server, please ensure that you have installed them.

### 2.Create a new database in mysql for this website, and create tables as following.

#Mysql command

#This table is used to store user information.

CREATE TABLE user<br /\> 
(
id int NOT NULL PRIMARY KEY AUTO_INCREMENT,<br /\> 
username varchar(50) NOT NULL UNIQUE ,<br /\> 
password varchar(50) NOT NULL,<br /\> 
lv int NOT NULL<br /\> 
);

#This table is used to store article information.

CREATE TABLE article<br /\> 
(<br /\> 
id int PRIMARY KEY NOT NULL AUTO_INCREMENT,<br /\> 
author varchar(50) NOT NULL,<br /\> 
title text NOT NULL,<br /\> 
brief text ,<br /\> 
onindex tinyint NOT NULL,<br /\> 
createtime DATETIME NOT NULL,<br /\> 
updatetime DATETIME NOT NULL,<br /\> 
content text,<br /\> 
type text<br /\> 
);<br /\> 

### 3.Create an user as administrator for you to login the background,set \`lv\` = 15 to guarantee to get all the authorizations.

#Mysql command

INSERT INTO user (\`username\`,\`password\`,\`lv\`)VALUES('test','test','15');

### 4.Here are some defination of the authorization management in this project. Once you want to get authorizations more than one , you just need to add them up.

`c_user = 0`                  // normal user<br /\> 
`c_admin_base = 1`;           // access to background<br /\> 
`c_admin_insert_article = 2`  // insert article<br /\> 
`c_admin_manage_article = 4`  // delete , change , top article (NOT INCLUDE insert)<br /\> 
`c_admin_super = 8`           // user management<br /\> 

### 5.You also should to write `config.json`, which is settings file for the website. Here are what the website needs: <br /\> 

`db_host` :       // the address of mysql server<br /\> 
`db_user` :       // the username of mysql<br /\> 
`db_password` :   // the password of mysql<br /\> 
`listen_port` :   // the port of http listen , the default value is 80<br /\> 
`article_type` :  // the types of article, which should be split by ','<br /\> 

We also provide the `config.json.default` as template, you can refer to it.<br /\> 

### 6.The project need some Node.js dependencies, use `npm install` command to install them.<br /\> 
(If you can't automatically install all the dependencies, you can find the name of them in `server.js` and install them manually.)<br /\> 

###  7.Render `node server.js` command.<br /\>
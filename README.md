a normal homework of furry >_<

###################################

About deployment
=============================

### 1.This project use `Node.js` + `mysql` as server , please ensure that you have installed them.

### 2.Create a new database in mysql for this website , and create tables as following.

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

### 3.Create an user as administrator for you to login the background,set \`lv\` = 15 to guarantee to get all the authorization.

#Mysql command

INSERT INTO user (\`username\`,\`password\`,\`lv\`)VALUES('test','test','15');

### 4.Here are some defination of the authorization management in this project . Once you want to get authorization more than one , you just need to add them up.

`c_user = 0`                  //normal user<br /\> 
`c_admin_base = 1`;           // access to background<br /\> 
`c_admin_insert_article = 2`  // insert article<br /\> 
`c_admin_manage_article = 4`  // delete , change , top article (NOT INCLUDE insert)<br /\> 
`c_admin_super = 8`           // user management<br /\> 

### 5.You also should to write `config.json` , which is settings file for the website. we need FIVE attributes.<br /\> 

`db_host` :       //the address of mysql server<br /\> 
`db_user` :       //the username of mysql<br /\> 
`db_password` :   //the password of mysql<br /\> 
`listen_port` :   //the port of http listen , the default value is 80<br /\> 
`article_type` :  //the types of article , which should be split by ','<br /\> 

we also provide the `config.json.default` as template , you can refer to it.<br /\> 

### 6.The project need some Node.js dependencies , use `npm install` command to install them.<br /\> 
(If you can't automatically install all the dependencies , you can find the name of them in `server.js` and install them manually.)<br /\> 

###  7.render `node server.js`.<br /\>
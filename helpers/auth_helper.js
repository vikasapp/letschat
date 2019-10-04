var express = require('express');
var app = express();
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var messagesModule = require('../modules/messages');
var usersModule = require('../modules/users');

function checkEmail(req, res, next){
  // console.log(req.body);
  var email = req.body.email;
  usersRecord = usersModule.findOne({email:email});
  usersRecord.exec((err, data)=>{
    if(err) throw err;
    if(data){
      let alertclass = 'success'; 
      return res.render('register', {title: "Letschat", alertclass:alertclass, msg: "email already exist."});
    }
    next();
  });
}

function checklogin(req, res, next){  
  userToken = localStorage.getItem("userToken");
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
  } catch(err) {
    // console.log(err);
    return res.redirect("/login");
    // res.end('err');
  }
  next();
}

function isLogin(req, res, next){  
  userToken = localStorage.getItem("userToken");
  try {
    var decoded = jwt.verify(userToken, 'loginToken');
    return res.redirect("/");
  } catch(err) {
    // console.log(err);
    // return res.redirect("/login");
    // res.end('err');
  }
  next();
}

module.exports = {
    checklogin,
    isLogin,
    checkEmail
};
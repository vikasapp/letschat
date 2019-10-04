var express = require('express');
var app = express();
var session = require('express-session');
var router = express.Router();
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var usersModule = require('../modules/users');
var authHelper = require('../helpers/auth_helper');

/* GET home page. */
router.get('/register', authHelper.isLogin, function(req, res, next) {
  var msg = '';
  var alertclass = '';
  // console.log(res);
  res.render('register', { title: 'Register', msg: msg, alertclass: alertclass });
});

/* POST home page. */
router.post('/register', authHelper.checkEmail, function(req, res, next) {
  var body = req.body;
  var name = body.name;
  var email = body.email;
  var password = body.password;
  let msg = '';
  // console.log(body);
  let alertclass = 'success'; 

  if(password == '' || password == ' '){
    msg = 'Enter name.';
    res.render('register', { title: 'Register', msg: msg, alertclass: alertclass });
  }
  else{
    password = bcrypt.hashSync(password, 10);
    var userDetail = new usersModule({
      name:name,
      email:email,
      password:password,
    });

    userDetail.save((err, res)=>{
      if(err) throw err;
      // console.log(res);
    });
    msg = 'Register Successfully';
    res.render('register', { title: 'Register', msg: msg, alertclass: alertclass });
  }
});

module.exports = router;

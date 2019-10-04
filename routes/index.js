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

var messagesModule = require('../modules/messages');
var usersModule = require('../modules/users');
var authHelper = require('../helpers/auth_helper');

/* GET home page. */
router.get('/', authHelper.checklogin, function(req, res, next) {
  var userData = localStorage.getItem('userData');
  // console.log(typeof(userData));
  // userData = JSON.stringify(userData);
  var userEmail = localStorage.getItem('userEmail');
  usersRecord = usersModule.find( { email: { $ne: userEmail } });
  usersRecord.exec((err, response)=>{
    if(err) throw err;
    var data = [];
    data.records={};
    data.userData={};
    data.msg = '';
    data.userData=userData;
    var receiverEmail = userData.email;
    data.title = 'Letschat';
    data.alertclass = 'success'; 
    data.receiverEmail=receiverEmail;
    if(response){
      data.records=response;
    }
    res.render('index', data);
  });
});

/* POST home page. */
router.post('/', authHelper.checklogin, function(req, res, next) {
  var body = req.body;
  // var senderEmail = body.senderEmail;
  // var receiverEmail = body.receiverEmail;
  var message = body.message;
  var msg = '';
  // console.log(message);
  var alertclass = 'success'; 
  var messageDetail = new messagesModule({
    message:message
  });

  messageDetail.save((err, res)=>{
    if(err) throw err;
  });
  res.render('index', { title: 'Letschat', msg: msg, alertclass: alertclass });
});

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

/* GET LOG OUT. */
router.get('/logout', function(req, res, next) { 
  localStorage.removeItem('userData');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userToken');
  res.redirect('login');
});

/* GET home page. */
router.get('/login', authHelper.isLogin, function(req, res, next) {
  var msg = '';
  var alertclass = 'success'; 
  console.log(req.session);
  res.render('login', { title: 'Login',msg:msg });
});

/* POST home page. */
router.post('/login', function(req, res, next) {
  var body = req.body;
  var email = body.email;
  var password = body.password;
  var checkUser = usersModule.findOne({ email : email } );
  checkUser.exec((err, data)=>{
    if(err) throw err;
    // console.log(data);
    var getID = data._id;
    var getEmail = data.email;
    var getPassword = data.password;

    // data.pop(data.password);
    
    if(bcrypt.compareSync(password, getPassword)){
      var token = jwt.sign({ userID: getID }, 'loginToken');
      localStorage.setItem('userToken', token);
      localStorage.setItem('userEmail', getEmail);
      localStorage.setItem('userData', data);
      res.redirect('/');
    }
    else{
      res.redirect("/login");
    }
  });
});

module.exports = router;

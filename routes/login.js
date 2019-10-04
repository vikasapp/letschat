
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

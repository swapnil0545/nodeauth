var express = require('express');
var router = express.Router();
var User = require('../models/user');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{
    'title':'Register'
  })
});

router.get('/login', function(req, res, next) {
  res.render('login',{
    'title':'Login'
  })
});

router.post('/register', function(req, res, next) {
  //get form values
  let name = req.body.name;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let password2 = req.body.password2;


  //check for img field
  if(req.files && req.files.length>0){
    console.log('uploading file...');
    
    //file info
    var profileImageName = req.files[0].originalname;
    //var profileImageOriginalName = req.body.profileimage.name;
    var profileImageMime = req.files[0].mimetype;
    var profileImagePath = req.files[0].path;
    var profileImageExt = req.files[0].extension;
    var profileImageSize = req.files[0].size;
  }else{
    //set a default profileimage
    var profileImageName= 'noimage.png';
  }

  //form validation
  req.checkBody('name','Name field is required').notEmpty();
  req.checkBody('email','Email field is required').notEmpty();
  req.checkBody('email','Email not valid').isEmail();
  req.checkBody('password','Name field is required').notEmpty();
  req.checkBody('password2','Passwords do not match').equals(password);
  
  //check for errors
  var errors = req.validationErrors();

  if(errors){
    res.render('register',{
      errors : errors,
      name : name ,
      email : email,
      username : username,
      password : password,
      password2 : password2
    });
  }else{
    var newUser = new User({
      name : name ,
      email : email,
      username : username,
      password : password,
      password2 : password2,
      profileimage : profileImageName
    });

    //Create user
    User.createUser(newUser,(err,user)=>{
        if(err) throw errr;
        console.log(user);
    });
    //success message
    req.flash('success','You are now a registered user and may login.');
    res.location('/');
    res.redirect('/');
  }

});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(
    function(username,password,done){
        User.getUserByUsername(username,function(err,user){
            if(err) throw err;
            if(!user){
              console.log('unkown user');
              return done(null,false,{message: 'unkown user'});
            }
            User.comparePassword(password,user.password,function(err,isMatch){
              if(err) throw err;
              if(isMatch){
                return done(null,user);
              }else{
                console.log('Invalid pwd');
                return done(null,false,{message : 'Invalid password'});
              }
            })
        })
    })
);

router.post('/login', passport.authenticate('local',{failureRedirect : '/users/login', failureFlash : 'Invalid Username or password'}),function(req,res){
  console.log('authentication sucessful');
  req.flash('Success','You are logged in.');
  res.redirect('/');

});

router.get('/logout', function(req,res){
  req.logout();
  req.flash('success','You have logged out');
  res.redirect('/users/login')
});

module.exports = router;

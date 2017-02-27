var express = require('express');
var router = express.Router();

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
  if(req.files && req.files.profileimage){
    console.log('uploading file...');
    
    //file info
    var profileImageOriginalName = req.files.profileimage.originalname;
    var profileImageName = req.files.profileimage.name;
    var profileImageMime = req.files.profileimage.mimetype;
    var profileImagePath = req.files.profileimage.path;
    var profileImageExt = req.files.profileimage.extension;
    var profileImageSize = req.files.profileimage.size;
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
      profileimage : profileimageName
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

module.exports = router;

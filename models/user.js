var mongoose = require('mongoose');
var db = mongoose.connect;
var bcrypt= require('bcrypt');


mongoose.connect('mongodb://localhost/nodeauth')
//user schema
var UserSchema = mongoose.Schema({
    username : {
        type : String,
        index : true
    },
    password :{
        type : String,
        required:true,
        bcrypt : true
    },
    email : {
        type : String
    },
    name : {
        type : String
    },
    profileImage : {
        type : String
    }
});


var User = module.exports = mongoose.model('User',UserSchema);

module.exports.createUser = function(newUser,callback){
    bcrypt.hash(newUser.password, 10,function(err,hash){
        if(err) throw err;
        //set hashed password
        newUser.password=hash;

        newUser.save(callback);
    })
}

module.exports.getUserByUsername = function(username, callback){
    var query = {username : username};
    User.findOne(query,callback);
}

module.exports.comparePassword = function(candidatepassword, hash, callback){
    bcrypt.compare(candidatepassword,hash,function(err,isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
}

module.exports.getUserById = function(id, callback){
    User.findById(id,callback);
}


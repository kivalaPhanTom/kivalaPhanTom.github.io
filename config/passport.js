var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var bcriptjs = require('bcryptjs');
// Load model
var User = require('../models/User');
module.exports = function (passport) {
    passport.use(
        new LocalStrategy({ usernameField: 'Email', passwordField: 'Password' }, (Email, Password, done) => {
            //tim username
            if(!Email || !Password)
            {
                return done(null, false, { message: 'Vui lòng điền đầy đủ!' });
            }
            else
            {
                User.findOne({ Email: Email })
                .then(user => {
                    if (!user) {
                        return done(null, false, { message: 'Tài khoản không tồn tại!' });
                    }
                    bcriptjs.compare(Password, user.Password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        }
                        else {
                            return done(null, false, { message: 'Mật khẩu không đúng!' })
                        }

                    });
                })
            }
            
        })
    );
    passport.use(new FacebookStrategy({
        clientID: "246684573420158",
        clientSecret: "d837e96bf832911dee6290d95d25a3a8",
        callbackURL: "http://localhost:3000/auth/fb/cb",
        profileFields: ['email', 'gender', 'locale', 'displayName']
    },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({Social_id: profile._json.id}, function(err, user){
                if(err){
                    return done(err);
                }
                if(user)
                {
                    return done(null, user)
                }
                else{
                    Role = "customer"
                    var newUser = new User({
                        Social_id: profile._json.id,
                        Name: profile._json.name,
                        Email: profile._json.email,
                        Role
                    })
                    newUser.save((err)=>{
                        return done(null, newUser)
                    })
                }
            })
        
        }
    ))
    passport.use(new GoogleStrategy(
        {
            clientID: "781596029230-7047ojj28hrjaibodqvc6ik2in104llu.apps.googleusercontent.com",
            clientSecret: "HOAiV-0oCKzTeeUp9G-nDGKg",
            callbackURL: "http://localhost:3000/auth/gg/cb"
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({Social_id: profile._json.sub}, function(err, user){
                if(err){
                    return done(err);
                }
                if(user)
                {
                    return done(null, user)
                }
                else{
                    var newUser = new User({
                        Social_id: profile._json.sub,
                        Name: profile._json.name,
                        Email: profile._json.email
                    })
                    newUser.save((err)=>{
                        return done(null, newUser)
                    })
                }
            })
        }
    ));
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

} 
var express = require('express');
var router = express.Router();
var passport = require('passport')

router.get("/fb", passport.authenticate('facebook', {scope:['email']}))
router.get("/gg", passport.authenticate('google', {scope:['email','profile']}))
router.get("/fb/cb",
  passport.authenticate('facebook', {
    failureRedirect: '/users/login',
    successRedirect: '/'
}));
router.get("/gg/cb",
  passport.authenticate('google', {
    failureRedirect: '/users/login',
    successRedirect: '/'
}));

module.exports = router;
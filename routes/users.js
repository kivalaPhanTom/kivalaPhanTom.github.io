var express = require('express');
var router = express.Router();
var bcriptjs = require("bcryptjs")
var passport = require('passport')

// User model
const User = require("../models/User");
// xu ly dang xuat
router.get('/logout', isLoggedIn, (req, res) =>{
  delete req.session.cart
  req.logout();
  req.flash('success_msg', 'Đăng xuất thành công!');
  res.redirect('/users/login')  
})
router.use('/', notLoggedIn, function(req, res, next){
  next();
})
// login page
router.get('/login', function (req, res) {
  res.render('DangNhap');
});
// register page
router.get('/register', function (req, res) {
  res.render('DangKy');
});
// xu ly dang ki tai khoan
router.post('/register', function (req, res) {
  const { Email, Name, Address, Phone, Password, Password1 } = req.body;
  let errors = [];
  if(Password1 !== Password)
  {
    errors.push({msg:"Mật khẩu không khớp!"})
  }
  if(errors.length > 0)
  {
    res.render('DangKy',{
      errors,
      Email,
      Name, 
      Address, 
      Phone, 
      Password,
      Password1
    })
  }else{
    User.findOne({Email: Email})
    .then(user => {
      if(user){
        errors.push({msg:"Email đã được sử dụng!"})
        res.render('DangKy',{
          errors,
          Email,
          Name, 
          Address, 
          Phone, 
          Password,
          Password1
        })  
      }
      else{
        const newUser = new User({
          Email,
          Name,
          Address,
          Phone,
          Password
        })
        //hash
        bcriptjs.genSalt(10, (err, salt)=> bcriptjs.hash(newUser.Password, salt, (err, hash)=>{
          newUser.Password = hash;
          newUser.save()
            .then(user => {
              req.flash('success_msg', 'Tạo tài khoản thành công!')
              res.redirect('login')
            })
            .catch(err => console.log(err))

        }))
      }
    })
  }
})
// xu ly dang nhap 
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});



module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('/users/login')
}
function notLoggedIn(req, res, next){
  if(!req.isAuthenticated()){
    return next()
  }
  res.redirect('/')
}

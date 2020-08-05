var express = require('express');
var router = express.Router();
var bcriptjs = require("bcryptjs")
var passport = require('passport')
var nodemailer =  require('nodemailer');
var crypto = require('crypto')
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
        Code = "0";
        Role = "customer"
        const newUser = new User({
          Email,
          Name,
          Address,
          Phone,
          Password,
          Role
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
router.get('/forgot', function(req, res){
  res.render('forgotpass')
})
//gui mail
router.get('/getkeyreset/:email', function(req, res){
  email = req.params.email
  console.log(req.params.email)
  User.findOne({Email: email})
    .then(user => {
      if(user){
        if(user.Social_id)
        {
          return res.json("Email không tồn tại!")
        }
        else{
          var code = crypto.randomBytes(Math.ceil(12/2)).toString('hex').slice(0,12);
          console.log(code);
          var transporter =  nodemailer.createTransport({ // config mail server
            service: 'Gmail',
            auth: {
                user: 'thanhtri1954@gmail.com',
                pass: '01653306330'
            }
          });
          var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'D2HSHOP',
            to: email,
            subject: 'Reset password',
            text: 'You recieved message from D2HSHOP',
            html: '<p>Mã xác nhận lấy lại mật khẩu:  </b>'+ code
          }
          transporter.sendMail(mainOptions, function(err, info){
            if (err) {
                console.log(err);
                return res.json("error")
            } else {
                console.log('Message sent: ' +  info.response);
                User.updateOne({Email:email}, {"Code": code}, function(err){
                  if(err)
                  {
                    console.log(err)
                  }
                  else{
                    return res.json("success")
                  }
                })
                
            }
          });
        }
        
        // res.redirect('/users/login')
      }
      else{
        return res.json("Email không tồn tại!")
        // return res.json("success")
        // res.redirect('/users/register')
      }
    })
})
//xac thuc code
router.get('/verifyCode/:email/:code', function(req, res){
  code = req.params.code;
  email = req.params.email;
  User.findOne({Email: email})
  .then(user =>{
    console.log(user)
    if(user.Code == code){
      return res.json("success")
    }
    else{
      return res.json("Mã xác nhận không đúng!")
    }
  })
})
//doi pass
router.post('/resetPass', function(req, res){
  console.log(req.body)
  User.findOne({Email: email})
  .then(user=>{
    if(req.body.Password != req.body.Password1){
      return res.json("Mật khẩu không khớp!")
    }
    else{
      bcriptjs.genSalt(10, (err, salt)=> bcriptjs.hash(req.body.Password, salt, (err, hash)=>{
        var Password = hash;
        console.log(Password)
        User.updateOne({Email:req.body.Email}, {"Password":Password, "Code":"0"}, function(err){
          if(err){
            console.log(err);
          }
          else{
            req.flash('success_msg', 'Đổi mật khẩu thành công!');
            res.json('/users/login') 
          }
        })

      }))
    }
  })
})
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

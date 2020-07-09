    var express = require('express');
    var router = express.Router();
    var mongodb = require('mongodb')
    var MongoClient = mongodb.MongoClient;
    var urldb = 'mongodb://localhost:27017'
    var Cart = require("../models/Cart")
    var Product = require("../models/Product");
const { months } = require('moment-timezone');
    /* GET home page. */

    MongoClient.connect(urldb, {useNewUrlParser: true}, function(err, client){
        var db = client.db('web');
        router.get('/cart', function(req, res, next) {
            
            if(!isEmpty(req.session.cart))
            {
                var cart = new Cart(req.session.cart);
                res.render('GioHang', {products: cart.generateArray(), totalPrice: cart.totalPrice});
            }
            if(req.user){
                db.collection("Cart").findOne({customerId : String(req.user._id)}, function(err, data){
                    if(data){
                        var cart = new Cart(data);
                        res.render('GioHang', {products: cart.generateArray(), totalPrice: data.totalPrice});
                    }
                    else{
                        res.render('GioHang', {products: null, totalPrice: "0"});
                    }
                    
                })  
            }
            else{
                res.render('GioHang', {products: null, totalPrice: "0"});
            }
            
            
        });
        router.get(('/add-to-cart/:id'), isLoggedIn, function(req, res){
            var ProductId = req.params.id;
            db.collection("Cart").findOne({customerId: String(req.user._id)}, function(err, data){
                if(data){
                    req.session.cart = data;
                    var cart = new Cart(req.session.cart);
                    Product.findOne({_id: req.params.id}, function(err, product){
                        console.log(product)
                        if(err){
                            console.log(err)
                        }
                        else
                        {
                            cart.add(product, product._id, String(req.user._id))
                            req.session.cart = cart;
                            console.log(req.session.cart)
                            db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                                db.collection("Cart").insertOne(req.session.cart, function(err){
                                    if(err)
                                    {
                                        console.log(err)
                                    }
                                    else{
                                        res.redirect('/cart')
                                    }
                                })
                            })
                            
                        }
                    })

                }
                else{
                    if(isEmpty(req.session.cart))
                    {
                        req.session.cart = {}
                        var cart = new Cart(req.session.cart);
                        Product.findOne({_id: req.params.id}, function(err, product){
                            console.log(product)
                            if(err){
                                console.log(err)
                            }
                            else
                            {
                                cart.add(product, product._id, String(req.user._id))
                                req.session.cart = cart;
                                db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                                    db.collection("Cart").insertOne(req.session.cart, function(err){
                                        if(err)
                                        {
                                            console.log(err)
                                        }
                                        else{
                                            res.redirect('/cart')
                                        }
                                    })
                                })
                                
                            }
                        })
                    }
                    else
                    {
                        var cart = new Cart(req.session.cart);
                        Product.findOne({_id: req.params.id}, function(err, product){
                            if(err){
                                console.log(err)
                            }
                            else
                            {
                                cart.add(product, product._id, String(req.user._id))
                                req.session.cart = cart;
                                console.log(req.session.cart)
                                db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                                    db.collection("Cart").insertOne(req.session.cart, function(err){
                                        if(err)
                                        {
                                            console.log(err)
                                        }
                                        else{
                                            res.redirect('/cart')
                                        }
                                    })
                                })                         
                            }
                        })
                    }
                }
            })
        });
        //Giảm 1 sản phẩm
        router.get(('/reduceByOne/:id'), isLoggedIn, function(req, res){
            var productId = req.params.id;
            if(!isEmpty(req.session.cart)){
                console.log("adad")
                var cart = new Cart(req.session.cart);
                cart.reduceByOne(productId);
                req.session.cart = cart;
                console.log(req.session.cart)
                db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                    console.log("da xoa")
                    if(!err)
                    {
                        db.collection("Cart").insertOne(req.session.cart, function(err){
                            if(err)
                            {
                                console.log(err)
                            }
                            else{
                               
                                return res.json(cart)
                            }
                        })
                    }               
                })     
            }
            else{
                db.collection("Cart").findOne({customerId: String(req.user._id)}, function(err, data){
                    var cart = new Cart(data);
                    cart.reduceByOne(productId);
                    req.session.cart = cart;
                    console.log(req.session.cart)
                    db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                        db.collection("Cart").insertOne(req.session.cart, function(err){
                            if(err)
                            {
                                console.log(err)
                            }
                            else{
                                
                                return res.json(cart)
                            }
                        })
                    })  
                })    
            }
        });
        //Tăng 1 sản phẩm
        router.get('/addByOne/:id', function(req, res){
            var productId = req.params.id;
            if(!isEmpty(req.session.cart)){
                var cart = new Cart(req.session.cart);
                cart.addByOne(productId);
                req.session.cart = cart;
                db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                    console.log("da xoa")
                    if(!err)
                    {
                        db.collection("Cart").insertOne(req.session.cart, function(err){
                            if(err)
                            {
                                console.log(err)
                            }
                            else{
                                
                                return res.json(cart)
                            }
                        })
                    }               
                }) 
                
            }
            else{
                db.collection("Cart").findOne({customerId: String(req.user._id)}, function(err, data){
                    var cart = new Cart(data);
                    cart.addByOne(productId);
                    req.session.cart = cart;
                    var db = client.db('web');
                    db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                        db.collection("Cart").insertOne(req.session.cart, function(err){
                            if(err)
                            {
                                console.log(err)
                            }
                            else{
                                
                                return res.json(cart)
                            }
                        })
                    })       

                })   
            }
        });
        router.post(('/thanhtoan'), isLoggedIn, function(req, res){
            var idItem = req.body.i;
            if(typeof(idItem) === typeof([])){
                console.log("Object")
                db.collection("Cart").findOne({customerId : String(req.user._id)}, function(err, data){
                    if(err){
                        console.log(err)
                    }
                    if(data){
                        var cart = new Cart(data);
                        var Items = []
                        var total = 0;
                        for( var id in idItem)
                        {
                            Items.push(cart.items[idItem[id]])
                            total += MakeInterger(cart.items[idItem[id]].price) 
                        }  
                        req.session.itemOrder = Items;
                        total = MakeDecimal(total)
                        res.render('thanhtoan',{Items: Items, totalPrice:total})
                    }   
                })  
            }
            else
            {
                console.log("String")
                db.collection("Cart").findOne({customerId : String(req.user._id)}, function(err, data){
                    if(data){
                        var total = 0;
                        var cart = new Cart(data);
                        var Items = []
                        Items.push(cart.items[idItem])
                        total += MakeInterger(cart.items[idItem].price) 
                        total = MakeDecimal(total)
                        req.session.itemOrder = Items;
                        res.render('thanhtoan',{Items: Items, totalPrice: total})
                    }   
                })
            }
             
        });
        router.get(('/chitietdonhang/:id'), isLoggedIn, function(req, res){

        })
        router.post(('/chitietdonhang'), isLoggedIn, function(req, res){
            var date = new Date();
            //phai lay thang + 1 vi mac dinh la 0 -> 11
            month = date.getMonth() + 1;
            var insertJson = {
                id_customer: req.user._id,
                name_customer: req.body.Name,
                address: req.body.Address,
                phone: req.body.Phone,
                email: req.body.Email,
                note:req.body.note,
                totalPrice: req.body.totalPrice,
                items: req.session.itemOrder,
                completed: 0,
                create_day: date.getDate()+"/" + month + "/"+date.getFullYear()
            }
            db.collection("Cart").findOne({customerId : String(req.user._id)}, function(er, data){
                var cart = new Cart(data)
                var abc = req.session.itemOrder;
                abc.forEach(function(a){
                    cart.removeItem(a.item._id)
                })
                req.session.cart = cart;
                db.collection("Cart").deleteOne({customerId: String(req.user._id)}, function(err){
                    db.collection("Cart").insertOne(req.session.cart, function(err){
                        req.session.itemOrder = {}
                        db.collection("Order").insertOne(insertJson, function(err, data){
                            res.render('chitietdonhang', {order: data.ops[0]})
                        })
                    })
                })
                
                
            })
            
            
        });
    })
    module.exports = router;
    function isLoggedIn(req, res, next){
        if(req.isAuthenticated()){
        return next()
        }
        res.redirect('/users/login')
    }
    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    function MakeDecimal(Number) {
        Number = Number + "" // Convert Number to string if not
        Number = Number.split('').reverse().join(''); //Reverse string
        var Result = "";
        for (i = 0; i <= Number.length; i += 3) {
            Result = Result + Number.substring(i, i + 3) + ".";
        }
        Result = Result.split('').reverse().join(''); //Reverse again
        if (!isFinite(Result.substring(0, 1))) Result = Result.substring(1, Result.length); // Remove first dot, if have.
        if (!isFinite(Result.substring(0, 1))) Result = Result.substring(1, Result.length); // Remove first dot, if have.
        return Result;
    }
    function MakeInterger(Number)
    {
        var string = Number.toString();
        var newStr = string.split('.').join('')
        return(parseInt(newStr))
    }
    

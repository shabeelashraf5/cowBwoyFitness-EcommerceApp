var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayout = require('express-ejs-layouts')
const bodyparser = require('body-parser')
var session = require ('express-session')
const mongoose = require('mongoose')
const ejs = require('ejs')
const nocache = require("nocache")
const flash = require('connect-flash');
const dotenv = require('dotenv').config()

console.log(dotenv.parsed)

var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/product');
var cartRouter = require('./routes/cart')
var checkoutRouter = require('./routes/checkout')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout', './layouts/userlayout')

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayout)
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(session({
  secret:'thisissecret' ,
  cookie: {maxAge:6000000}, resave: false , saveUninitialized: true

}))
app.use(nocache())
app.use(flash());


app.use('/', usersRouter);
app.use('/admin', adminRouter);
app.use('/product', productRouter);
app.use('/cart', cartRouter);
app.use('/checkout', checkoutRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

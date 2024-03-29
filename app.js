var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const cors = require('cors');
//const passport = require('./passport');

var indexRouter = require('./routes/index');
var billsRouter = require('./routes/bills');


var app = express(); //inicializa express

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use(passport.initialize());
app.use(cors());

app.use('/', indexRouter);
app.use('/api/v1/bills', billsRouter);



module.exports = app;

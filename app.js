var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var billsRouter = require('./routes/bills');


var app = express(); //inicializa express

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/v1/bills', billsRouter);

//setup connnection
const mongoose = require('mongoose');
//const DB_URL = (process.env.DB_URL || 'mongodb://localhost')
const DB_URL = "mongodb+srv://assurance:kUnHHe6RI5dWS2VZ@cluster0.miuwv1w.mongodb.net/bills" 
console.log("connecting to database: %s", DB_URL);

mongoose.connect(DB_URL);
const db = mongoose.connection;
//recover from error
//db.on('error', console.error.bind(console, 'db connection error'));

module.exports = app;

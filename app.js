var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs')

var sqlite = require('sqlite3')

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

fs.mkdir("db", function() {
  var db = new sqlite.Database('db/db.db', function() {
    db.run("create table member(\
      id integer PRIMARY KEY autoincrement\
      , name varchar(15)\
      , image_url varchar(1000)\
      , intro text\
      , weibo_url varchar(1000)\
      , weibo_snippet text\
      , position integer default 10\
      , join_date integer\
    )"
      , function(error) {
        if (!error) {
          // console.log("Insert test data");
          // var insert = "INSERT INTO member(name, image_url, intro, weibo_url, weibo_snippet) VALUES ";
          // db.run(insert + "('Bill', 'http://', 'What is what', 'https://baidu.com/', 'What what. @what');");
          // db.run(insert + "('Yunhai Lu', 'http://', 'Mengmeng', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Bingo Du', 'http://', 'COO', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Zhenyu Li', 'http://', 'Disigner', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Peter Jiang', 'http://', 'CEO', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Jemmey Ji', 'http://', 'Tech', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Flora Zhu', 'http://', 'PM', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Hongfang Fan', 'http://', 'Purchasing', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Yunqiang Dai', 'http://', 'Struct', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Bruse Zheng', 'http://', 'Struct', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run(insert + "('Nader', 'http://', 'Intern', 'http://baidu.com/', 'Ha hi ho.')");
          // db.run("UPDATE member SET image_url = 'http://tp3.sinaimg.cn/1852220282/50/5622385613/0'");
        } else {
          console.log("Table exists");
        }
        console.log("Close db");
        db.close()
    })
  })
})


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.locals.pretty = true;
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000)

module.exports = app;

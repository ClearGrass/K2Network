var express = require('express');
var sqlite = require('sqlite3')


var router = express.Router();
var db = new sqlite.Database('db/db.db', function() {
  db.run("create table member(\
    id integer PRIMARY KEY autoincrement\
    , name varchar(15)\
    , image_url varchar(1000)\
    , intro varchar(100)\
    , weibo_url varchar(100)\
    , weibo_snippet varchar(1000)\
    , position integer default 10\
    , join_date integer\
  )"
    , function(error) {
      if (!error) {
        var insert = "INSERT INTO member(name, image_url, intro, weibo_url, weibo_snippet) VALUES ";
        db.run(insert + "('Bill', 'http://', 'What is what', 'https://baidu.com/', 'What what. @what');");
        db.run(insert + "('Yunhai Lu', 'http://', 'Mengmeng', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Bingo Du', 'http://', 'COO', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Zhenyu Li', 'http://', 'Disigner', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Peter Jiang', 'http://', 'CEO', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Jemmey Ji', 'http://', 'Tech', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Flora Zhu', 'http://', 'PM', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Hongfang Fan', 'http://', 'Purchasing', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Yunqiang Dai', 'http://', 'Struct', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Bruse Zheng', 'http://', 'Struct', 'http://baidu.com/', 'Ha hi ho.')");
        db.run(insert + "('Nader', 'http://', 'Intern', 'http://baidu.com/', 'Ha hi ho.')");
        db.run("UPDATE member SET image_url = 'http://tp3.sinaimg.cn/1852220282/50/5622385613/0'");
      }
  })
})



/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {title : "Express"})
})

router.get('/list', function(req, res, next) {
  var skip = req.query.skip ? parseInt(req.query.skip) : 0
  var limit = req.query.limit ? parseInt(req.query.limit) : 0
  skip = skip ? skip : 0
  limit = limit ? limit : 30
  db.each("select count(0) from member", function(err, row){
    totalCount = (row['count(0)'])
    db.all("select * from member limit " + skip + "," + limit, function(err, rows) {
      console.log(JSON.stringify(rows))
      var entries = {
        "members" : rows,
        "totalCount": totalCount,
        "skip": skip,
        "limit": limit
      }
      res.json(entries)
    })
  })

});

router.get("/search/:searchText", function (req, res, next) {
  var skip = req.query.skip ? parseInt(req.query.skip) : 0
  var limit = req.query.limit ? parseInt(req.query.limit) : 0
  skip = skip ? skip : 0
  limit = limit ? limit : 30
  var text = req.params.searchText;
  db.all("select * from member where 1=0\
    or  name like '%" + text + "%'\
    or  intro like '%" + text + "%'\
    or  weibo_snippet like '%" + text + "%'\
    limit " + skip + "," + limit, function(err, rows) {
    var entries = {
      "members" : rows,
      "skip": skip,
      "limit": limit
    }
    res.json(entries)
  })

})

module.exports = router;

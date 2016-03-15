var express = require('express');
var sqlite = require('sqlite3');
var Util = require('../base/Util');
var Interface = require('../base/Interface');

var router = express.Router();


/* GET home page. */
router.get("/", function (req, res, next) {
  Interface.ajax({path: '/ajax/list', method: 'GET'}).then(function(data){
    res.render("web/k2", data);
    console.log(data);
  }, Util.errCall);
});

/* GET mobile home page */
router.get("/mobile", function (req, res, next) {
  Interface.ajax({path: '/ajax/list', method: 'GET'}).then(function(data){
    res.render("mobile/mobile", data);
    console.log(data);
  }, Util.errCall);
});

/* GET mobile item page */
router.get("/mobile/item", function (req, res, next) {
  if(req.query && req.query.id){
    Interface.ajax({path: '/ajax/get?id='+req.query.id, method: 'GET'}).then(function(data){
      res.render("mobile/item", data);
      console.log(data);
    }, Util.errCall);
  } else {
    res.render('Error: Require param id!');
  }
});

/* GET search page. */
router.get("/search", function (req, res, next) {
    if(req.query.search){
        Interface.ajax({path: '/ajax/search/' + req.query.search, method: 'GET'}).then(function(data){
            if(data.members && data.members.length){
                res.render("web/search", data);
            } else {
                data.name = req.query.search;
                res.render("web/search", data);
            }
        });
    } else {
        res.render("web/search", {});
    }
});

router.get('/ajax/list', function(req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
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
      db.close()
    })
  })

});

router.get("/ajax/search/:searchText", function (req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
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
    db.close()
  })

})

router.get("/ajax/get", function (req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
  var skip = req.query.skip ? parseInt(req.query.skip) : 0
  var limit = req.query.limit ? parseInt(req.query.limit) : 0
  var id = req.query.id || ''
  skip = skip ? skip : 0
  limit = limit ? limit : 30
  var text = req.params.searchText;
  db.all("select * from member where id=" + id + " limit 1", function(err, rows) {
    if (rows && rows.length > 0) {
        res.json(rows[0])
    } else {
        res.json({})
    }

    db.close()
  })

})


module.exports = router;

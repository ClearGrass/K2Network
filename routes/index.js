var express = require('express');
var sqlite = require('sqlite3');
var Util = require('../base/Util');
var Interface = require('../base/Interface');

var router = express.Router();

/* 中间件分发 */
router.get("/", function (req, res, next){
  var ua = req.headers['user-agent'].toLowerCase();
  console.log(ua, ua.indexOf('android') < 0, ua.indexOf('iphone') < 0);
  if(ua.indexOf('android') < 0 && ua.indexOf('iphone') < 0){
    next();
  } else {
    res.redirect('/mobile');
  }
});

router.get("/mobile", function (req, res, next){
  var ua = req.headers['user-agent'].toLowerCase();
  console.log(ua, ua.indexOf('android') < 0, ua.indexOf('iphone') < 0);
  if(ua.indexOf('android') < 0 && ua.indexOf('iphone') < 0){
    res.redirect('/');
  } else {
    next();
  }
});

/* GET home page. */
router.get("/", function (req, res, next) {
  Interface.ajax({path: '/api/list', method: 'GET'}).then(function(data){
    res.render("web/k2", data);
    console.log(data);
  }, Util.errCall);
});

/* GET mobile home page */
router.get("/mobile", function (req, res, next) {
  Interface.ajax({path: '/api/list', method: 'GET'}).then(function(data){
    for(var i = 0; i < data.members.length; i++){
      data.members[i].intro = Util.formatWord(data.members[i].intro, 50);
    }
    res.render("mobile/mobile", data);
  }, Util.errCall);
});

/* GET mobile item page */
router.get("/mobile/member", function (req, res, next) {
  if(req.query && req.query.id){
    if(req.query.id == 'tab'){
      res.render("mobile/item", {
        id: 'tab',
        name: "K2 创业网络",
        image_url: "/images/logo@2x.png",
        intro: "<p>和 2000 年诞生的 DoNews 一样，2013 年 1 月 3 日创立的 K2 创业网络也是一场实验。多年之后，回望这段历史，K2 希望人们记住它最早在 SNS 上实验了公司合伙之外的价值创造方法，就像现在，人们用最早的博客实验记住当年的 DoNews。</p><p>1937 年诺奖得主科斯发表《企业的性质》，指出，当市场交易成本高于企业内部管理成本时，企业便产生了。企业存在正是为了用费用较低的企业内交易替代费用较高的市场交易。当市场交易的边际成本等于企业内部管理协调的边际成本时，就是企业规模扩张的界限。</p><p> 2013 年以来，K2 成员间业已积累起了可观的信用资本，依靠这些信用资本，能大幅降低 K2 成员间的交易成本，交易的边际成本降低后，企业规模就会减少，转而更多地依靠合作、外包、换股、信托、合并等市场交易。这样一来，K2成员企业不必持续增加员工人数和管理成本，就能不断扩大业务边界，快速形成产品服务闭环，大范围整合资源，迅速投放市场，立即看反馈，及时掉头。这正是每个创业者求之不得的创业环境，创业比的就是谁能更快速更低成本地试错。</p><p> 科斯相逢 SNS，K2 诞生，创业生长。</p>",
        weibo_url: "",
        weibo_snippet: "",
        position: 10,
        join_date: 0
      });
    } else {
      Interface.ajax({path: '/api/member?id='+req.query.id, method: 'GET'}).then(function(data){
        data.intro = Util.toLink(data.intro);
        data.weibo_url = Util.delHttp(data.weibo_url);
        res.render("mobile/item", data);
        console.log(data);
      }, Util.errCall);
    }
  } else {
    res.render('Error: Require param id!');
  }
});

/* GET search page. */
router.get("/search", function (req, res, next) {
  console.log(req.headers['user-agent']);
    if(req.query.search){
      var q = req.query.search
      q = encodeURI(q)
      console.log(q);
        Interface.ajax({path: '/api/search/?q=' + q, method: 'GET'}).then(function(data){
            if(data.members && data.members.length){
                if(Util.isMobile(req)){
                  for(var i = 0; i < data.members.length; i++){
                    data.members[i].intro = Util.formatWord(data.members[i].intro, 50);
                  }
                }
                res.render("web/search", data);
            } else {
                res.render("web/search", data);
            }
        });
    } else {
        res.render("web/search", {});
    }
});


router.get('/api/list', function(req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY);
  var skip = req.query.skip ? parseInt(req.query.skip) : 0;
  var limit = req.query.limit ? parseInt(req.query.limit) : 0;
  skip = skip ? skip : 0;
  limit = limit ? limit : 30;
  db.each("select count(0) from member", function(err, row){
    totalCount = (row['count(0)']);
    db.all("select * from member  order by position ASC, id ASC limit " + skip + "," + limit, function(err, rows) {
      console.log(JSON.stringify(rows));
      var entries = {
        "members" : rows,
        "totalCount": totalCount,
        "skip": skip,
        "limit": limit
      };
      res.json(entries);
      db.close();
    })
  })

});

router.get("/api/search/", function (req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY);
  var skip = req.query.skip ? parseInt(req.query.skip) : 0;
  var limit = req.query.limit ? parseInt(req.query.limit) : 0;
  var simple = !!req.query.simple;
  var limit = req.query.only_return_name;
  skip = skip ? skip : 0;
  limit = limit ? limit : 30;
  var text = req.query.q;
  console.log(req.query);
  console.log(simple);
  if (!simple) {
    db.all("select * from member where 1=0\
      or  name like '%" + text + "%'\
      or  intro like '%" + text + "%'\
      or  weibo_snippet like '%" + text + "%'\
      limit " + skip + "," + limit, function(err, rows) {
      var entries = {
        "search_text": text,
        "members" : rows,
        "skip": skip,
        "limit": limit
      };
      res.json(entries);
      db.close();
    });
  } else {
    var names = []
    db.each("select name from member where 1=0\
      or  name like '%" + text + "%'\
      ", function(err, rows) {
      names.push(rows['name'])
    }, function(err, count) {
      res.json(names);
      db.close();
    });
  }

});

router.get("/api/member", function (req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY);
  var skip = req.query.skip ? parseInt(req.query.skip) : 0;
  var limit = req.query.limit ? parseInt(req.query.limit) : 0;
  var id = req.query.id || '';
  skip = skip ? skip : 0;
  limit = limit ? limit : 30;
  var text = req.params.searchText;
  db.all("select * from member where id=" + id + " limit 1", function(err, rows) {
    if (rows && rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.json({});
    }
    db.close();
  });

});


module.exports = router;

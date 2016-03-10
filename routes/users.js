var express = require('express');
var sqlite = require('sqlite3')
var util = require('util')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
  var id = req.params.id
  db.all("select * from member", function(err, rows) {
    res.render("members", {title : "LIST", datas: rows})
    db.close()
    // res.json(row)
  })
});

router.get("/:id/edit", function (req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
  var id = req.params.id
  db.all("select * from member where id = "+id+" limit 1", function(err, rows) {
    if (rows) {
      row = rows[0]
      console.log(row)
      res.render("edit", {title : "EDIT", data: row})
    } else {
      next()
    }
    db.close()

    // res.json(row)
  })
// res.render("edit", {title : "EDIT"})
})
router.post('/:id', function(req, res, next) {
  var db = new sqlite.Database('db/db.db')
  var id = req.params.id

  var update = "UPDATE member set name='%s', join_date = %d, image_url='%s', intro='%s', weibo_url='%s', weibo_snippet='%s' WHERE id = %s"
  update = util.format(update, req.body.name, 0, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, id)
  console.log(update);
  db.run(update, function(err) {
    db.close()
    res.redirect(id + "/edit")
  })
})

router.post('/:id/delete', function(req, res, next) {
  var db = new sqlite.Database('db/db.db')
  var id = req.params.id

  var update = "delete from member WHERE id = %s"
  update = util.format(update, id)
  console.log(update);
  db.run(update, function(err) {
    db.close()
    res.redirect("/users")
  })
})

router.post('/', function(req, res, next) {
  var db = new sqlite.Database('db/db.db')
  var id = req.params.id
  var insert = "INSERT INTO member(name, join_date, image_url, intro, weibo_url, weibo_snippet) VALUES ('%s', %d, '%s', '%s', '%s', '%s')";
  insert = util.format(insert, req.body.name, 0, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet)
  console.log(insert);
  db.run(insert, function(err, result) {
    db.close()
    res.redirect(this.lastID + "/edit")
  })
})

router.get("/new", function (req, res, next) {
  res.render("edit", {title : "ADD", data: {}})
})

module.exports = router;

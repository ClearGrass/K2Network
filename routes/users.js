var express = require('express');
var sqlite = require('sqlite3')
var util = require('util')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
  var id = req.params.id
  db.all("select * from member order by position ASC, id ASC", function(err, rows) {
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

router.post('/orders', function(req, res, next) {
  console.log(req.body);
  var idorder = {}
  for (var key in req.body) {
    if (key.indexOf("order_id_") == 0) {
      var id = key.substring("order_id_".length)
      var order = parseInt(req.body[key])
      if (parseInt(id) >= 0 && order >= 0) {
        idorder[id] = order
      } else {

      }
    }
  }
  var db = new sqlite.Database('db/db.db')
  updateSql = "UPDATE member set position=%d WHERE id = %d;\n"
  allSql = "";
  for (var key in idorder) {
    if (idorder.hasOwnProperty(key)) {
      pos = idorder[key]
      updateOrder = util.format(updateSql, pos, key)
      allSql += updateOrder
    }
  }
  db.exec(allSql, function(err) {
    db.close()
    console.log(allSql);
    res.redirect("/users")
  })
})


router.post('/:id', function(req, res, next) {
  var db = new sqlite.Database('db/db.db')
  var id = req.params.id

  var update = "UPDATE member set name='%s', join_date = %d, image_url='%s', intro='%s', weibo_url='%s', weibo_snippet='%s', position='%d' WHERE id = %s"
  update = util.format(update, req.body.name, 0, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, req.body.position, id)
  console.log(update);
  db.run(update, function(err) {
    db.close()
    if (err) {
      console.log(err);
      res.redirect("/users")
    } else {
      res.redirect("/users")
    }
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
  var insert = "INSERT INTO member(name, join_date, image_url, intro, weibo_url, weibo_snippet, position) VALUES ('%s', %d, '%s', '%s', '%s', '%s', '%s')";
  insert = util.format(insert, req.body.name, 0, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, req.body.position)
  console.log(insert);
  db.run(insert, function(err, result) {
    db.close()
    res.redirect("/users")
  })
})


router.get("/new", function (req, res, next) {
  res.render("edit", {title : "ADD", data: {}})
})

module.exports = router;

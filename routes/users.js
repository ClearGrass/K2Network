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
  db.get("select * from member where id = "+id+" limit 1", function(err, row) {
    if (row) {
      datte = new Date(row.join_date)
      y = datte.getFullYear()
      m = datte.getMonth() + 1
      d = datte.getDate()
      row.join_date_string = util.format("%d-%s-%s",  y, m > 9 ? "" + m : "0" + m, d >= 9 ? "" + d : "0" + d)
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
  req.body.join_date = Date.parse(req.body.join_date_string)
  console.log(req.body);
  var update = "UPDATE member set name='%s', join_date = %d, image_url='%s', intro='%s', weibo_url='%s', weibo_snippet='%s', position='%d' WHERE id = %s"
  update = util.format(update, req.body.name, req.body.join_date, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, req.body.position, id)
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
  if (req.body.position == 0) {
    db.get("SELECT MAX(position)+1 as pos FROM member", function(error, result) {
      req.body.position = result['pos']
      insert()
    })
  } else {
    insert()
  }

  function insert () {
    req.body.join_date = Date.parse(req.body.join_date_string)
    var insert = "INSERT INTO member(name, join_date, image_url, intro, weibo_url, weibo_snippet, position) VALUES ('%s', %d, '%s', '%s', '%s', '%s', '%s')";
    insert = util.format(insert, req.body.name, 0, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, req.body.position)
    console.log(insert);
    db.run(insert, function(err, result) {
      db.close()
      res.redirect("/users")
    })
  }
})


router.get("/new", function (req, res, next) {
  var db = new sqlite.Database('db/db.db')
  db.get("SELECT MAX(position)+1 as pos FROM member", function(error, result) {
    db.close()
    position = result['pos']
    res.render("edit", {title : "ADD", data: {"join_date_string":"2016-01-01", "position": position}})
  })

})

module.exports = router;

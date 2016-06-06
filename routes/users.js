var express = require('express');
var sqlite = require('sqlite3')
var util = require('util')
var Util = require('../base/Util');

var http=require('http');
var fs =require('fs');
var path = require("path");

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

/* GET users listing. */
router.get('/', function(req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
  var id = req.params.id
  db.all("select * from member order by position ASC, id ASC", function(err, rows) {
    var rows = rows.map(function(user) {
      var base64QrString = user.qr_string ? new Buffer(user.qr_string).toString('base64') : ""
      user.qr_image = user.qr_string ? "/qr/" + base64QrString + "?base64=1&autoCreate=1&wxLogo=1" : null
      return user
    })
    rows = Util.dealUsersLink(rows)
    res.render("members", {title : "LIST", datas: rows})
    db.close()
    // res.json(row)
  })
});

router.get('/download', function(req, res, next) {
  res.writeHead(200, {'Content-Type':'application/db'});
  var rs=fs.createReadStream('db/db.db');
  rs.pipe(res);
});


router.get("/:id/edit", function (req, res, next) {
  var db = new sqlite.Database('db/db.db', sqlite.OPEN_READONLY)
  var id = req.params.id
  db.get("select * from member where id = "+id+" limit 1", function(err, row) {
    if (row) {
      if (row.join_date > 0) {
        datte = new Date(row.join_date)
        y = datte.getFullYear()
        m = datte.getMonth() + 1
        d = datte.getDate()
        row.join_date_string = util.format("%d-%s-%s",  y, m > 9 ? "" + m : "0" + m, d >= 9 ? "" + d : "0" + d)
      }
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


router.post('/:id', upload.single("avater_upload"), function(req, res, next) {
  var db = new sqlite.Database('db/db.db')
  var id = req.params.id
  req.body.join_date = Date.parse(req.body.join_date_string ? req.body.join_date_string : "2016-01-01")
  dealUploadedAvater(req)
  var update = "UPDATE member set name='%s', join_date = %d, image_url='%s', intro='%s', weibo_url='%s', weibo_snippet='%s', qr_string='%s', position='%d' WHERE id = %s"
  update = util.format(update, req.body.name, req.body.join_date, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, req.body.qr_string, req.body.position, id)
  console.log(update);
  db.run(update, function(err) {
    db.close()
    if (err) {
      console.log(err);
      res.redirect("/users")
    } else {
      if (req.body.qr_string) {
        var createQrUrl = "/qr/" + req.body.qr_string + "?autoCreate=1"
        Interface.ajax({path: createQrUrl, method: 'GET'}).then(function(data){
          res.redirect("/users")
        }, Util.errCall);
      } else {
        res.redirect("/users")
      }
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

router.post('/', upload.single("avater_upload"), function(req, res, next) {
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
    dealUploadedAvater(req)
    console.log(req.body);
    console.log(req.file);
    req.body.join_date = Date.parse(req.body.join_date_string ? req.body.join_date_string : "2016-01-01")
    var insert = "INSERT INTO member(name, join_date, image_url, intro, weibo_url, weibo_snippet, qr_string, position) VALUES ('%s', %d, '%s', '%s', '%s', '%s', '%s', '%s')";
    insert = util.format(insert, req.body.name, 0, req.body.image_url, req.body.intro, req.body.weibo_url, req.body.weibo_snippet, req.body.qr_string, req.body.position)
    console.log(insert);
    db.run(insert, function(err, result) {
      db.close()
      if (req.body.qr_string) {
        var createQrUrl = "/qr/" + req.body.qr_string + "?autoCreate=1"
        Interface.ajax({path: createQrUrl, method: 'GET'}).then(function(data){
          res.redirect("/users")
        }, Util.errCall);
      } else {
        res.redirect("/users")
      }
    })
  }
})


function dealUploadedAvater(req) {
  var file = req.file;
  var fields = req.body;
  if (file) {
    var fileName;
    if (fields.image_url) {
      var image_url = fields.image_url.trim();
      console.log(image_url);
      if (image_url.indexOf("/") >= 0) {
        fileName = image_url.substring(image_url.lastIndexOf("/") + 1);
        if (!fileName) {
          fileName = file.originalname
        }
      } else {
        fileName = image_url
      }
    } else {
      fileName = file.originalname
    }
    if (!fileName) {
      fileName = "avater_image_" + new Date().getTime()
    }
    var extname = path.extname(fileName);
    console.log("extname:" + extname);
    var fileext = "." + file.mimetype.substr(file.mimetype.lastIndexOf('/') + 1)
    if (fileext == ".jpeg") {
      fileext = ".jpg"
    }
    if (fileext != extname) {
      fileName = fileName + fileext
    }
    try {
      fs.mkdirSync("./public/images/header/")
    } catch (e) {}
    var filePath = "./public/images/header/" + fileName
    req.body.image_url  = "/images/header/" + fileName

    fs.readFile(file.path, function (err, data) {
      if (!err) {
        fs.writeFile(filePath, data, function (err) {
          if (!err) {
            fs.unlinkSync(file.path);
          }
        });
      }
    });
    // var data = fs.readFileSync(file.path);
    // fs.writeFileSync(filePath, data);
    // fs.unlinkSync(file.path);
  } else {

  }
}

router.get("/new", function (req, res, next) {
  var db = new sqlite.Database('db/db.db')
  db.get("SELECT MAX(position)+1 as pos FROM member", function(error, result) {
    db.close()
    position = result['pos']
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.render("edit", {title : "ADD", data: {"join_date_string":"2016-01-01", "position": position}})
  })

})


module.exports = router;

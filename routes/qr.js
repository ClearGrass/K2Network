var express = require('express');
var util = require('util')

var http=require('http');
var fs =require('fs');
var path = require("path");

var FormData = require('form-data');

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

router.post("/", upload.single("file"), function (req, res, next) {
  console.log(req.body);
  console.log(req.file);

  var form = new FormData();
  form.append('file', fs.createReadStream(req.file.path));
  form.submit({
      host: 'api.qrserver.com',
      path: '/v1/read-qr-code/',
    }, function(err, response) {
      fs.unlink(req.file.path)
      if (err) {
        res.statusCode = 500;
        res.json("Not uploaded")
        return;
      }
      var str = '';
      response.on('data', (chunk) => {
        str += chunk
      });
      response.on('end', () => {
        res.json(JSON.parse(str))
      })
    });
})

router.get("/:qrString", function (req, res, next) {
  var qrdir = "./public/images/header/qr/";
  var qrString = req.params.qrString;
  var base64String = qrString;
  var autoCreate = req.query.autoCreate;
  if (req.query.base64 == 1) {
    qrString = new Buffer(base64String, 'base64').toString('ascii');
  } else {
    base64String = new Buffer(qrString).toString('base64');
  }
  try {
    fs.mkdirSync(qrdir)
  } catch (e) {}

  var qrname = qrdir + base64String + '.png';
  fs.stat(qrname, function(err, stat) {
    console.log("file state : " + stat);
    if (err) {
      //文件不存在
      if (autoCreate == 1) {
        console.log("create qr file");
        //创建文件
        var qr = require('qr-image');
        var code = qr.image(qrString, {type: "png"})
        code.pipe(fs.createWriteStream(qrname));
        res.type("png");
        code.pipe(res);
        return
      } else {
          console.log("Not found file");
          //404
          next()
          return;
      }
    }
    console.log("read and output file");
    //输出文件
    res.type("png");
    fs.createReadStream(qrname).pipe(res);
  });
})

module.exports = router;

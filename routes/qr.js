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
  var qrString = req.params.qrString
  if (req.query.base64 == 1) {
    qrString = new Buffer(qrString, 'base64').toString('ascii');
    console.log(qrString)
  } else {
    console.log(new Buffer(qrString).toString('base64'));
  }
  var qr = require('qr-image');
  var code = qr.image(qrString, {type: "svg"})
  res.type("svg")
  code.pipe(res)
})

module.exports = router;

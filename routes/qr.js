var express = require('express');
var util = require('util')

var http=require('http');
var fs =require('fs');
var path = require("path");

var router = express.Router();

var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// router.post("/", upload.single("upload_qr"), function (req, res, next) {
//   console.log(req.body);
//   console.log(req.file);
//   res.json({"qr" : "imgTag"})
// })

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

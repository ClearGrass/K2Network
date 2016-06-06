var Util = {
    extend: function(src, opts){
        var obj = {};
        for(var key in opts){
            obj[key] = src[key] ? src[key] : opts[key];
        }
        return obj;
    },
    errCall: function(err){
        res.render(err);
    },
    toLink: function(url){
        var reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        var newStr = url.replace(reg, "<a href='$1$2' target='_blank' style='color:#4e4e4e;text-decoration:underline;display:inline;'>$2</a>");
        return newStr;
    },
    delHttp: function(url){
        var reg = /(http:\/\/|https:\/\/)/g;
        var newStr = url.replace(reg, '');
        return newStr;
    },
    formatWord: function(str, length){
        var len = length || 150;
        var newStr = str.substring(0,len);
        if(str.substring(0,len) != str){
            newStr += " ...";
        }
        return newStr;
    },
    isMobile: function(req){
        return (req.headers['user-agent'].toLowerCase().indexOf('iphone') >= 0) || (req.headers['user-agent'].toLowerCase().indexOf('android') >= 0);
    },
    dealUsersLink: function(rows, isSingle) {
      config = require("../config/admin")
      if (isSingle) {
        user = rows;
        if (config.users_header_base_url) {
          var base64QrString = user.qr_string ? new Buffer(user.qr_string).toString('base64') : ""
          var qrFile = "/images/header/qr/" + base64QrString + ".png";
          user.qr_image = user.qr_string ? config.users_header_base_url + qrFile : user.qr_image;
          user.image_url = user.image_url ? config.users_header_base_url + user.image_url : user.image_url;
        }
        return user;
      } else {
        var rows = rows.map(function(user) {
          if (config.users_header_base_url) {
            var base64QrString = user.qr_string ? new Buffer(user.qr_string).toString('base64') : ""
            var qrFile = "/images/header/qr/" + base64QrString + ".png";
            user.qr_image = user.qr_string ? config.users_header_base_url + qrFile : user.qr_image;
            user.image_url = user.image_url ? config.users_header_base_url + user.image_url : user.image_url;
          }
          return user;
        })
        return rows;
      }
    }

};

module.exports = Util;

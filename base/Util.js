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
    }
};

module.exports = Util;

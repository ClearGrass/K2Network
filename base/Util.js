var Util = {
    extend: function(src, opts){
        var obj = {};
        for(var key in opts){
            obj[key] = src[key] ? src[key] : opts[key];
        }
        return obj;
    }
};

module.exports = Util;
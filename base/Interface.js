var http = require('http');
var q = require('q');
var Config = require('../base/Config');
var Util = require('../base/Util');

var ajax = function(conf){
    var deferred = q.defer();
    //var headers = req.headers;
    //headers.host = 'www.xxx.com';
    var options = Util.extend(conf, Config.request);
    var req = http.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (data) {
            var data = JSON.parse(data);
            //success(res,data);
            deferred.resolve(data);
        });
    });
    req.on('error', function(e){
        console.log("auth_user error: " + e.message);
        deferred.reject(e);
    });
    req.write(require('querystring').stringify(conf.params));
    req.end();
    return deferred.promise;
};

exports.ajax = ajax;
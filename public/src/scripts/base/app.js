define(['jquery', 'backbone','base/router', 'base/view', 'views/viewport', 'base/config', 'local/local'], function($, Backbone, Routers, view, viewport, Config, local) {
    return {
        init : function(){
            //配置路由
            var Router = Backbone.Router.extend({
                routes: {
                    'home': Routers.router("home"),
                    '*defaultAction': Routers.router("defaultAction")
                }
            });

            var router = new Router();
            router.on('route', function (route, params) {
                //这里route是路由对应的方法名
                console.log('hash change', arguments);

            });

            //初始化viewport界面
            viewport.init(function(){
                Backbone.history.start({pushstate:true});
            });
        }
    };
});	
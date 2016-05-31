var wxBridge = (function(){
    //if(!window.WeixinJSBridge) return;
    var opts = {
        "img_url": "/images/logo@2x.png",
        "link": "http://k2.cm",
        "desc": "K2 创业网络",
        "title": "K2 创业网络"
        };

    function onBridgeReady() {
        WeixinJSBridge.on('menu:share:appmessage', function(argv) {
            WeixinJSBridge.invoke('sendAppMessage', opts, function(res) {
                WeixinJSBridge.log(res.err_msg);
            });
        });

        WeixinJSBridge.on('menu:share:timeline', function(argv) {
            WeixinJSBridge.invoke("shareTimeline", opts, function(e){
                //alert(e.err_msg);
            });
        });
    }

    return {
        init: function(){
            if (typeof WeixinJSBridge === "undefined"){
                if (document.addEventListener){
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                }
            }else{
                onBridgeReady();
            }
        },
        //分享到朋友圈
        weixinShareTimeline: function (opts){
            WeixinJSBridge.invoke('shareTimeline',{
                "img_url": opts.imgUrl,
                //"img_width":"640",
                //"img_height":"640",
                "link": opts.link,
                "desc": opts.desc,
                "title": opts.title
            });
        },

        //发送给好友
        weixinSendAppMessage: function (title,desc,link,imgUrl){
            WeixinJSBridge.invoke('sendAppMessage',{
                //"appid":appId,
                "img_url":imgUrl,
                //"img_width":"640",
                //"img_height":"640",
                "link":link,
                "desc":desc,
                "title":title
            });
        },

        //分享到腾讯微博
        weixinShareWeibo: function (title,link){
            WeixinJSBridge.invoke('shareWeibo',{
                "content":title + link,
                "url":link
            });
        },

        //关注指定的微信号
        weixinAddContact: function (name){
            WeixinJSBridge.invoke("addContact", {webtype: "1",username: name}, function(e) {
                WeixinJSBridge.log(e.err_msg);
                //e.err_msg:add_contact:added 已经添加
                //e.err_msg:add_contact:cancel 取消添加
                //e.err_msg:add_contact:ok 添加成功
                if(e.err_msg == 'add_contact:added' || e.err_msg == 'add_contact:ok'){
                    //关注成功，或者已经关注过
                }
            })
        }
    }
})();
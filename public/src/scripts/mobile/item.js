$(function(){
    $('body').on('click', '.closeBtn', function(e){
        //location.href = '/mobile';
        history.back();
    });

    var id = location.search.substring(1).split('=')[1] || '';
    if(id == 'tab'){
        $('.avatar img').css({'padding': '5% 35% 0%'});
    }
    $('.container .weibo').hide();

    $.get('/api/member', {id: id}).then(function(resp){
        //console.log(resp);
        document.title = resp.name ? "K2 - " + resp.name : "K2 创业网络";
    });

    wxBridge && wxBridge.weixinShareTimeline({
        "img_url": "/images/logo@2x.png",
        "link": "http://k2.cm",
        "desc": "K2 创业网络",
        "title": "K2 创业网络"
    });
});

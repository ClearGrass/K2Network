$(function(){
    $('body').on('click', '.closeBtn', function(e){
        //location.href = '/mobile';
        history.back();
    });

    var id = location.search.substring(1).split('=')[1] || '';
    if(id == 'tab'){
        $('.avatar img').css({'padding': '5% 35% 0%'});
    }
    // $('.container .weibo').hide();

    //wxBridge.weixinShareTimeline({
    //    title: 'K2 创业网络', // 分享标题
    //    link: 'http://k2.cm', // 分享链接
    //    imgUrl: 'http://k2.cm/images/logo.png', // 分享图标
    //    success: function () {},
    //    cancel: function () {}
    //});
});

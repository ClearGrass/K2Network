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

    wx.onMenuShareTimeline({
        title: 'K2 创业网络', // 分享标题
        link: 'http://k2.cm', // 分享链接
        imgUrl: 'http://k2.cm/images/logo.png', // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});

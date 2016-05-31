$(function(){
    var startX = 0;
    var startY = 0;

    $('ul.row').imagesLoaded(function(){
        $('ul.row').masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });

    $('body')
        .on('touchstart', '.container ul li', function(e){
            startX = e.originalEvent.changedTouches[0].clientX;
            startY = e.originalEvent.changedTouches[0].clientY;
        })
        .on('touchend', '.container ul li', function(e){
            if(startX - e.originalEvent.changedTouches[0].clientX != 0 || startY - e.originalEvent.changedTouches[0].clientY != 0){
                return;
            }
            if(e.target.nodeName.toLowerCase() == 'a'){
                return;
            }
            var $li = $(this);
            var id = $li.attr('id');
            startX = 0, startY = 0;
            location.href = "/mobile/member?id=" + id;
        })
        .on('touchstart', '.tab', function(e){
            startX = e.originalEvent.changedTouches[0].clientX;
            startY = e.originalEvent.changedTouches[0].clientY;
        })
        .on('touchend', '.tab', function(e){
            if(startX - e.originalEvent.changedTouches[0].clientX != 0 || startY - e.originalEvent.changedTouches[0].clientY != 0){
                return;
            }
            startX = 0, startY = 0;
            location.href = "/mobile/member?id=tab";
        })
        .on('keypress', function(e){
            if($('.searchBar .search input:active') && e.which == 13){
                var val = $('.searchBar .search input').val();
                location.href = "/search?search=" + encodeURIComponent(val);
            }
        })
        .on('focus', '.searchInput', function(e){
            $(e.target).closest('.search').css({
                'box-shadow': '#1E90FF 0px 0px 1px 1px'
            });
        })
        .on('blur', '.searchInput', function(e){
            $(e.target).closest('.search').css({
                'box-shadow': ''
            });
        })
        .on('click', '.container ul li', function(e){
            if(e.target.nodeName.toLowerCase() == 'a'){
                return;
            }

            var $li = $(this);
            var id = $li.attr('id');
            scrollTop = $(document).scrollTop();

            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('android') < 0 && ua.indexOf('iphone') < 0){
                $.get('/api/member?id=' + id, function(data){
                    render(data);
                });
            } else {
                location.href = '/mobile/member?id=' + id;
            }
        });

    wx.onMenuShareTimeline({
        title: 'K2 创业网络', // 分享标题
        link: 'http://k2.cm', // 分享链接
        imgUrl: 'http://k2.cm/images/logo.png' // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});

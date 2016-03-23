$(function(){
    $('ul.row').imagesLoaded(function(){
        $('ul.row').masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });

    $('body')
        .on('click', '.search .closeSearch', function(e){
            if($('.search input').val()){
                location.href = "/";
            }
        })
        .on('click', '.container ul li', function(e){
            var $li = $(this);
            var id = $li.attr('id');

            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('android') < 0 && ua.indexOf('iphone') < 0){
                $.get('/api/member?id=' + id, function(data){
                    $.get('/dist/templates/card.html', function(tmpl){
                        $.blockUI({
                            message: _.template(tmpl)(data),
                            css: {
                                color:'#5d5d5d',
                                backgroundColor:'white',
                                border:0,
                                width: '30%',
                                height: 'auto',
                                top: '8%',
                                position: 'absolute',
                                cursor: '',
                                'box-shadow': '#999 0px 5px 20px',
                                'border-radius': 10
                            },
                            overlayCSS: {
                                backgroundColor: 'white',
                                cursor: '',
                                opacity: 0.95
                            }
                        });
                    });
                    $('.homePage').css({
                        //overflow: 'auto',
                        position: 'fixed'
                    });

                });
            } else {
                location.href = '/mobile/member?id=' + id;
            }
        })
        .on('click', '.blockOverlay', function(){
            $.unblockUI();
            $('.homePage').css({
                overflow: 'auto',
                height: 'auto',
                position: ''
            });
        })
        .on('keypress', function(e){
            if($('.searchRow .search input:active') && e.which == 13){
                var val = $('.searchRow .search input').val();
                location.href = "/search?search=" + encodeURIComponent(val);
            }
        })
        .on('focus', '.searchInput', function(e){
            $(e.target).closest('.search').css({
                'box-shadow': '#1E90FF 0px 0px 1px 2px'
            });
        })
        .on('blur', '.searchInput', function(e){
            $(e.target).closest('.search').css({
                'box-shadow': ''
            });
        });
        $(window).scroll(function(e){
            //console.log($(window).scrollTop());
            var height;
            if($(window).width() < 1600){
                height = 600;
            } else if($(window).width() < 2000){
                height = 750;
            } else {
                height = 850;
            }
            if($(window).scrollTop() >= height){
                $('.searchRow').addClass('searchTop');
            } else {
                $('.searchRow').removeClass('searchTop');
            }
        });

});

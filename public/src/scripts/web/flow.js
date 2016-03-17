$(function(){
    $('ul.row').imagesLoaded(function(){
        $('ul.row').masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });

    $('body')
        .on('click', '.search img', function(e){
            location.href = "/search";
        })
        .on('click', '.container ul li', function(e){
            var $li = $(this);
            var id = $li.attr('id');

            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('android') < 0 && ua.indexOf('iphone') < 0){
                $.get('/api/get?id=' + id, function(data){
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
                                'box-shadow': '#999 0px 5px 20px',
                                'border-radius': 10
                            },
                            overlayCSS: {
                                backgroundColor: 'white',
                                opacity: 0.8
                            }
                        });
                    });
                });
            } else {
                location.href = '/mobile/item?id=' + id;
            }
        })
        .on('click', '.blockOverlay', function(){
            $.unblockUI();
        })
        .on('keypress', function(e){
            if($('.searchRow .search input:active') && e.which == 13){
                var val = $('.searchRow .search input').val();
                location.href = "/search?search=" + val;
            }
        });
        $(window).scroll(function(e){
            //console.log($(window).scrollTop());
            var height;
            if($(window).width() < 1600){
                height = 700;
            } else if($(window).width() < 2000){
                height = 900;
            } else {
                height = 1100;
            }
            if($(window).scrollTop() >= height){
                $('.searchRow').addClass('searchTop');
            } else {
                $('.searchRow').removeClass('searchTop');
            }
        });

});

$(function(){
    $('ul.row').imagesLoaded(function(){
        $('ul.row').masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });

    $('body')
        .on('tap', '.container ul li', function(e){
            if(e.target.nodeName.toLowerCase() == 'a'){
                return;
            }
            var $li = $(this);
            var id = $li.attr('id');
            location.href = "/mobile/member?id=" + id;
        })
        .on('click', '.tab', function(e){
            location.href = "/mobile/member?id=tab";
        })
        .on('keypress', function(e){
            if($('.searchBar .search input:active') && e.which == 13){
                var val = $('.searchBar .search input').val();
                location.href = "/search?search=" + val;
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
        });

});

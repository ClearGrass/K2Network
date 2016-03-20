$(function(){
    $('ul.row').imagesLoaded(function(){
        $('ul.row').masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });

    $('body')
        .on('click', '.container ul li', function(e){
            if(e.target.nodeName.toLowerCase() == 'a'){
                return;
            }
            var $li = $(this);
            var id = $li.attr('id');
            location.href = "/mobile/member?id=" + id;
        })
        .on('keypress', function(e){
            if($('.searchBar .search input:active') && e.which == 13){
                var val = $('.searchBar .search input').val();
                location.href = "/search?search=" + val;
            }
        });

});

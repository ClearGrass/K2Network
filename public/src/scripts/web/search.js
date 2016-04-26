$(function(){
    $('body')
        .on('keypress', function(e){
            if($('.searchPage .search input:active') && e.which == 13){
                var val = $('.searchPage .search input').val();
                location.search = "search=" + encodeURIComponent(val);
            }
        })
        .on('click', '.closeSearch', function(e){
            $('.searchInput').val('');
            $('.search input').focus();
            //console.log($('.searchInput').val());
        })
        .on('click', '.closeBtn', function(e){
            location.href = '/';
        });
});
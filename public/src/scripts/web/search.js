$(function(){
    $('body')
        .on('keypress', function(e){
            if($('.searchPage .search input:active') && e.which == 13){
                var val = $('.searchPage .search input').val();
                location.search = "search=" + val;
            }
        })
        .on('click', '.closeBtn', function(e){
            location.href = '/';
        });
});
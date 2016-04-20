$(function(){
    $('body').on('click', '.closeBtn img', function(e){
        //location.href = '/mobile';
        history.back();
    });

    var id = location.search.substring(1).split('=')[1] || '';
    if(id == 'tab'){
        $('.avatar img').css({'padding': '5% 30%'});
    }
    $('.container .weibo').hide();
});
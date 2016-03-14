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
            $.get('/ajax/get?id=' + id, function(data){
                $.get('/dist/templates/card.html', function(tmpl){
                    $.blockUI({
                        message: _.template(tmpl)(data.members[0]),
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

        })
        .on('click', '.blockOverlay', function(){
            $.unblockUI();
        });

});
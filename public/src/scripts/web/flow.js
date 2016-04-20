$(function(){
    var scrollTop = 0;

    function render(data, fn){
        data.img_size = data.img_size || '100%';
        $.get('/dist/templates/card.html', function(tmpl){
            $.blockUI({
                message: _.template(tmpl)(data),
                css: {
                    color:'#5d5d5d',
                    backgroundColor:'transparent',
                    border:0,
                    width: '40%',
                    height: 'auto',
                    top: '8%',
                    left: '30%',
                    position: 'absolute',
                    cursor: '',
                    'margin-bottom': 20,
                    //'box-shadow': '#d9d9d9 0px 5px 15px',
                    'border-radius': 10
                },
                overlayCSS: {
                    backgroundColor: 'white',
                    cursor: '',
                    opacity: 0.95
                },
                onBlock: function(){
                    $(document).scrollTop(0);
                    $('.homePage').css({
                        //overflow: 'auto',
                        position: 'fixed',
                        'top': '-' + scrollTop + 'px'
                    });

                    fn && fn();
                }
            });
        });
    }

    function formatWord(str, length){
        var len = length || 150;
        var newStr = str.substring(0,len) + " ...";
        return newStr;
    }

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
        })
        .on('click', '.blockOverlay', function(){
            $('.homePage').css({
                overflow: 'auto',
                height: 'auto',
                position: ''
            });
            $(document).scrollTop(scrollTop);
            $.unblockUI({
                onUnblock: function(){
                    scrollTop = 0;
                }
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
                'box-shadow': '#1E90FF 0px 0px 1px 1px'
            });
        })
        .on('blur', '.searchInput', function(e){
            $(e.target).closest('.search').css({
                'box-shadow': ''
            });
        })
        .on('click', '.tab', function(e){
            var ua = navigator.userAgent.toLowerCase();
            if(ua.indexOf('android') < 0 && ua.indexOf('iphone') < 0){
                render({
                    image_url: '/images/logo.png',
                    img_size: '40%',
                    name: 'K2 创业网络',
                    intro: '<p>和 2000 年诞生的 DoNews 一样，2013 年 1 月 3 日创立的 K2 创业网络也是一场实验。多年之后，回望这段历史，K2 希望人们记住它最早在 SNS 上实验了公司合伙之外的价值创造方法，就像现在，人们用最早的博客实验记住当年的 DoNews。</p><p>1937 年诺奖得主科斯发表《企业的性质》，指出，当市场交易成本高于企业内部管理成本时，企业便产生了。企业存在正是为了用费用较低的企业内交易替代费用较高的市场交易。当市场交易的边际成本等于企业内部管理协调的边际成本时，就是企业规模扩张的界限。</p><p> 2013 年以来，K2 成员间业已积累起了可观的信用资本，依靠这些信用资本，能大幅降低 K2 成员间的交易成本，交易的边际成本降低后，企业规模就会减少，转而更多地依靠合作、外包、换股、信托、合并等市场交易。这样一来，K2成员企业不必持续增加员工人数和管理成本，就能不断扩大业务边界，快速形成产品服务闭环，大范围整合资源，迅速投放市场，立即看反馈，及时掉头。这正是每个创业者求之不得的创业环境，创业比的就是谁能更快速更低成本地试错。</p><p> 科斯相逢 SNS，K2 诞生，创业生长。</p>',
                    weibo_snippet: ' ',
                    weibo_url: ' '
                }, function(){
                    $('.card .weibo').hide();
                });
            } else {
                location.href = '/mobile/member?id=tab';
            }

        });
        $(window).scroll(function(e){
            //console.log($(window).scrollTop());
            var height;
            if($(window).width() < 1200){
                height = 520;
            } else if($(window).width() < 1600){
                height = 600;
            } else if($(window).width() < 2000){
                height = 680;
            } else if($(window).width() < 2300){
                height = 820;
            } else {
                height = 980;
            }
            if($(window).scrollTop() >= height){
                $('.searchRow').addClass('searchTop');
            } else {
                $('.searchRow').removeClass('searchTop');
            }
        });

});

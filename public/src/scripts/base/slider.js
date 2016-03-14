define(['jquery', 'underscore', 'css!styles/slider.css'], function($, _){
    function Slider(el, pos, data, seconds){
        this.$el = $(el);
        this.$pos = $(pos);
        this.data = data.concat(data[0]);
        this.index = 0;
        this.length = this.data.length;
        this.timer = null;
        this.seconds = seconds || 5;
        this.cb = function(){};
    }
    Slider.prototype = {
        constructor: Slider,
        init: function(fn){
            var _this = this;
            this.cb = fn;
            require(['text!../templates/slider.html'], function(doc){
                var tmpl = _.template(doc);
                _this.$el.html(tmpl({data: _this.data}));
                _this.$el.find('#sliders').css({width: _this.length * 100 + '%'});
                _this.$el.find('#sliders li').css({width: 100 / _this.length + '%'});
                _this.loop(fn);
                _this.setText();
                _this.setPos();
                _this.bind();
            });
        },
        move: function(dirc, fn){ //dirc 0:left, 1:right
            if(this.$el.attr('isActive') == 'true') return;
            this.$el.attr('isActive', 'true');
            dirc ? (this.index += 1) : (this.index -= 1);
            var _this = this;
            //console.log('index', _this.index);
            if(this.index == this.length){
                this.index = 1;
                this.$el.find('#sliders').css({'margin-left': '0%'});
            } else if(this.index < 0){
                this.index = this.length - 2;
                this.$el.find('#sliders').css({'margin-left': '-' + (this.length - 1) * 100 + '%'});
            }
            this.$el.find('#sliders').animate({'margin-left': '-' + _this.index * 100 + '%'}, '500', function(){
                _this.$el.attr('isActive', 'false');
                _this.setPos();
                _this.setText();
                fn && fn(_this.index);
            });
        },
        loop: function(fn){
            var _this = this;
            this.timer = setInterval(function(){
                _this.move(1, fn);
            }, _this.seconds * 1000);
        },
        setText: function(){
            var _this = this;
            this.$el.find('.headText').html(_this.data[_this.index].headText);
        },
        setPos: function(){
            var _this = this;
            this.$el.find('.btns li').removeClass('active');
            this.$el.find('.btns li[index="'+ ((_this.index == _this.length - 1) ? 0 : _this.index) +'"]').addClass('active');
        },
        bind: function(){
            var _this = this;
            var _x = 0, _y = 0;
            var _direction;
            _this.$el.on('touchstart', function(e){
                //console.log(_this.$el, 'touchstart', e);
                //e.preventDefault();
                //e.stopPropagation();
                //clearInterval(_this.timer);
                var _touch = e.originalEvent.targetTouches[0];
                _x= _touch.pageX;
                _y= _touch.pageY;
            });
            _this.$el.on('touchmove', function(e){
                console.log(e);
                if(!_direction){
                    if(Math.abs(e.originalEvent.targetTouches[0].pageX - _x) > Math.abs(e.originalEvent.targetTouches[0].pageY - _y)){
                        //横向滚动
                        _direction = 'horizontal';
                        clearInterval(_this.timer);
                    } else {
                        //竖着滑动
                        _direction = 'vertical';
                        //e.preventDefault();
                    }
                }
            });
            _this.$el.on('touchend', function(e){
                //console.log(_this.$el, 'touchend', e);
                //e.preventDefault();
                if(_direction == 'vertical'){
                    e.preventDefault();
                } else {
                    clearInterval(_this.timer);
                    var _touch = e.originalEvent.changedTouches[0];
                    console.log(_touch.pageX - _x);
                    if(_touch.pageX - _x > 0){ //left
                        _this.move(0, _this.cb);
                        _this.loop(_this.cb);
                    } else {    //right
                        _this.move(1, _this.cb);
                        _this.loop(_this.cb);
                    }
                }
                _direction = null;
                _x = 0, _y = 0;
            });
        }

    };

    return Slider;
});
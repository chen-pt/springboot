!(function() {
  'use strict';
  $.fn.slidebar = function(options) {
    $(this).each(function() {
      init.call(this, options);
    });
  };

  function init(options) {
    options = $.extend({
      'active': 'active'
    }, options);
    $(this).find('a[href$="' + location.pathname + '"]').parent().addClass('active');
    $(this).find('li').on('click', function() {
      // console.log(this);
    });

    /**
     * 计算侧边栏的高度是否高于页面高度
     */
    var calcHeight = (function() {
      // 好像没什么卵用
      var hasBindEvent = false;
      return function(event) {
        $('.nav-list').css('margin-top', '0');

        var eventType = 'mousewheel DOMMouseScroll';
        var slidebarHeight = $('.slidebar').height();
        var clientHeight = $(document).height() - $('header').height(); // 减去head的高度

        if( slidebarHeight > clientHeight ) {
          if (hasBindEvent) {
            // 大小发生改变 菜单栏的高度还是高于文档高度解除事件绑定 重新绑定
            $(document).off(eventType, '.slidebar');
          }
          $(document).on(eventType, '.slidebar', function (evt) {
            clientHeight = $(document).height() - $('header').height(); // 减去head的高度
            var detail = (evt.originalEvent.wheelDelta) ? evt.originalEvent.wheelDelta / 120 : -(evt.originalEvent.detail || 0) / 3;
            var top = detail * 80;

            var $navList = $('.nav-list');
            //var oldTop = parseInt($navList.css('margin-top'));
            top += parseInt($navList.css('margin-top'));
            if( top > 0 ) {
              // 滚动到最上面就不能动了
              top = 0;
            } else if( detail < 0 && $navList.height() + Math.abs(top) > clientHeight ) {
              // 向下滚动 并且 滚动到最下面已经可以看到了 就不需要滚动了
              top = clientHeight - $navList.height() - 50;
            }
            $navList.css('margin-top', top + 'px');
          });
          hasBindEvent = true;
        } else if(event.type != 'resize') {
          $(document).off(eventType, '.slidebar');
          hasBindEvent = false;
        }
      }
    })();

    $(window).on('resize', calcHeight);
    $(calcHeight);

    /*document.getElementsByClassName('slidebar')[0].addEventListener("DOMMouseScroll", function(event) {
      console.log(111);
    });*/
  }
})();
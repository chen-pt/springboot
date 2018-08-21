!(function() {
  'use strict';
  $.extend({
    'pjax':  function(options) {
      init.call(this, options);
    }
  });

  var container = '';

  // 初始化
  function init(options) {
    options = $.extend({
      selector: 'a[data-open=pjax]',
      container: '.main-content-inner'
    }, options);

    if (!options.container || !options.selector) {
      throw new Error('selector和container必须设置');
    }

    container = options.container;

    $(document).on('click', options.selector, function(e) {
      // 更新内容
      update.call(this, this.href);
      e.preventDefault();
    });
  }

  function update(url) {
    url = url || this.href;
    var state = {
      'page': location.href,
      'hash': location.hash,
      'search': location.search
    };
    $.ajax({
      'url': url
    }).done(function (rsp) {
      window.history.pushState(state, null, url);
      window.history.pushState(state, null, url);
      //var $body = $('body');
      $(container).empty().append( rsp );
    }).fail(function() {
      // TODO 获取内容失败
    });
  }

  window.addEventListener("popstate", function (event) {
    var currentState = event.state;
    if (currentState) {
      event.preventDefault();
      var href = currentState.page;
      if( currentState.search ) {
        href += currentState.href;
      }
      if( currentState.hash ) {
        href += currentState.hash;
      }
      //loadpage.call(this, currentState);
      update.call(this, href);
    }
  });

  // requirejs
  define(['jquery'], function($) {
    return $.fn.pjax;
  });
})();
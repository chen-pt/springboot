!(function() {
  'use strict';
  var watemark = {};

  function open(param) {
    var content = 123;
    layer.open({
      'type': 1,
      'title': '添加商品水印',
      'content': content
    });
  }

  watemark.open = open;

  if (define) {
    define('watemark', [], function() {
      return watemark;
    });
  } else {
    window.watemark = watemark;
  }
})();
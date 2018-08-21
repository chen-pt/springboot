!(function() {
  'use strict';
  // 注册奖励
  var TypeTask = {
    'init': init,
    'validate': validate,
    'getData': getData,
    'getShowModalParam': getShowModalParam
  };

  // 初始化
  function init() {
    $(document).on('keypress', '#zc-reward', function(evt) {
      if( ! /[\d\.]/.test(String.fromCharCode(+evt.charCode)) && evt.keyCode != 8 ) {
        evt.preventDefault();
      }
    });

    return TypeTask;
  }

  // 验证输入值
  function validate(data) {
    // TODO 验证输入值
    return true;
  }

  // 获取销售排名任务奖励规则
  function getData() {
    var rule = {};
    rule.reward = ~~($('#zc-reward').val() * 100);
    rule.user_type = 110;

    return {
      'type': 130,
      'rules': rule,
      'desc': $('#desc').val() || ''
    };
  }

  // 获取显示弹层的参数
  function getShowModalParam() {
    var html = $.tmpl(document.getElementById('zcjl-temp').innerHTML, {});
    var title = '注册奖励';

    return {
      'html': html,
      'title': title
    }
  }

  define(['jquery'], function() {

    return TypeTask.init();
  });
})();

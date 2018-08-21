!(function() {
  'use strict';
  // 销售奖励
  var TypeTask = {
    'init': init,
    'validate': validate,
    'getData': getData,
    'getShowModalParam': getShowModalParam
  };

  // 初始化
  function init() {
    $(document).on('keypress', '#up_real_pay,#reward', function(evt) {
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

    rule.user_type = $('#user_type').val();
    rule.reward = $('#reward').val() * 100;
    rule.up_real_pay = $('#up_real_pay').val() * 100;

    var data = {};
    data.rules = rule;
    data.type = 120;
    data.desc = $('#desc').val() || '';

    return data;
  }

  // 获取显示弹层的参数
  function getShowModalParam() {
    var html = $.tmpl(document.getElementById('xsjl-temp').innerHTML, {});
    var title = '销售奖励';

    return {
      'html': html,
      'title': title
    }
  }

  define(['jquery'], function() {

    return TypeTask.init();
  });
})();

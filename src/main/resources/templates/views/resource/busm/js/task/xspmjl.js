!(function() {
  'use strict';
  // 销售排名奖励
  var TypeTask = {
    'init': init,
    'validate': validate,
    'getData': getData,
    'getShowModalParam': getShowModalParam
  };

  // 初始化
  function init() {
    // 销售排名任务 是否需要报名参加时 隐藏/显示 报名时间
    $(document).on('click', '#is_need_sign_up', function() {
      if(this.checked) {
        $('#sign_up_time').show().find('input').prop('disabled', false);
      } else {
        $('#sign_up_time').hide().find('input').prop('disabled', true);
      }
    });

    // 销售排名奖励 增加条件
    $(document).on('blur', '#raward-rules .rule:eq(-1) input:not(:eq(0))', addRule);
    // 销售排名奖励 限制输入
    $(document).on('keypress', '#raward-rules input', function(evt) {
      if( ! /[\d\.]/.test(String.fromCharCode(+evt.charCode)) && evt.charCode != 0 ) {
        evt.preventDefault();
      }
    });
    // 最高多少名限制 1-100000
    $(document).on('keypress', '#top-number', function(evt) {
      var value = this.value + String.fromCharCode(+evt.charCode);
      // 输入的不是数字  输入的值不在1-100000区间 火狐上的删除键
      if( ! (/\d/.test(String.fromCharCode(+evt.charCode)) && (1 <= +value && +value <= 100000)) && evt.keyCode != 8 ) {
        evt.preventDefault();
      }
    });

    // 排名阶梯只能输入整数 并且 输入的值不能大于最高排名
    $(document).on('keypress', '.num-to', function(evt) {
      var value = this.value + String.fromCharCode(+evt.charCode);
      var top = ~~$('#top-number').val();
      if( ! (/\d/.test(String.fromCharCode(+evt.charCode)) && (1 <= +value && +value <= top)) && evt.keyCode != 8 ) {
        evt.preventDefault();
      }
    });

    $(document).on('blur', '#raward-rules .rule .num-to', function() {
      $(this).parent('.rule').next().find('.num-from').val(~~this.value + 1);
    });

    return TypeTask;
  }

  // 验证输入值
  function validate(data) {
    // TODO 验证输入值
    if(!data.rules || $.isEmptyObject(data.rules)) {
      return {
        'msg': '销售排名规则不能为空'
      };
    }

    if( ! (1 <= +data.rules.top && +data.rules.top <= 100000) ) {
      return {
        'msg': '奖励人数必须在1-100000之间'
      };
    }

    return true;
  }

  // 获取销售排名任务奖励规则
  function getData() {
    var rule = {};

    rule.top = ~~$('#top-number').val();

    rule.range = $('#raward-rules').find('.rule').map(function() {
      var from = ~~$(this).find('.num-from').val();
      var to = ~~$(this).find('.num-to').val();
      var reward = ~~($(this).find('.reward').val() * 100);

      if( ! (from && to && reward) ) {
        return null;
      } else {
        return {'from': from, 'to': to, 'reward': reward};
      }
    }).get();

    var data = {};
    data.rules = rule;
    data.type = 110;
    data.desc = $('#desc').val() || '';
    data.is_need_sign_up = +$('#is_need_sign_up').prop('checked');

    if(data.is_need_sign_up) {
      data.sign_up_start_time = $('#sign_up_start_time').val();
      data.sign_up_end_time = $('#sign_up_end_time').val();
    }

    return data;
  }

  // 获取显示弹层的参数
  function getShowModalParam() {
    var html = $.tmpl(document.getElementById('xspmjl-temp').innerHTML, {});
    var title = '销售排名奖励';

    return {
      'html': html,
      'title': title
    }
  }

  // 销售排名奖励增加规则
  var addRule = function() {
    var $rules = $('#raward-rules').find('.rule');

    if( $rules.size() > 4 ) {
      // 最多5条规则
      return;
    }
    var newRule = $rules.eq(-1).clone();
    newRule.find('input').val('');

    $rules.eq(-1).after(newRule);
  };

  define(['jquery'], function() {

    return TypeTask.init();
  });
})();

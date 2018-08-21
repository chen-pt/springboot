!(function() {
  // 结算明细
  'use strict';
  var YBZF;
  var dayModule = function() {
    if( ! (this instanceof dayModule) ) {
      return new dayModule();
    }
  };

  define(['services', 'pagin', 'sui'], function(__services) {
    YBZF = __services;
    return new dayModule();
  });

  // 页面加载时的初始化操作
  dayModule.prototype.init = function() {
    // 选择日期
    $(document).on('click', '.datepicker-days .day', function() {
      $('.datepicker-days').find('.day.active').removeClass('active');
      $(this).addClass('active');
    });

    $(document).on('click', '#save-day', function() {
      var siteid = $('#site-id').val();
      var set_type = $('#set_type').val();
      if(set_type == 3){
        var day = 1;
      }else{
        var day = $('#date' + set_type).find('.datepicker-days .day.active').data('day');
      }

      var data = {
        'siteid': siteid,
        'set_type': set_type,
        'day': day
      };

      setSettlementDay(data);
    });

    // 切换
    $(document).on('change', '#set_type', function() {
      $('.datepicker').hide();
      $('#date' + this.value).show();
    });
  };

  function setSettlementDay(data) {
    YBZF.services({
      'url': YBZF.hostname + '/account/setSettlementDay',
      'data': data
    }).done(function(rsp) {
      layer.msg(rsp.result.msg);
    });
  }

  // 根据条件获取数据
  dayModule.prototype.save = setSettlementDay;
})();
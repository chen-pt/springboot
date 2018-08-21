require(['common', 'sui'], function(YBZF,sui) {
  var site_id = $('#site_id').val();

  $(function () {
    YBZF.services({
      'url': YBZF.hostname + '/site/getTradesAutoTime',
      'data': {
        'site_id':site_id
      },
      'type':'post'
    }).done(function(rsp) {
      $('.trades_auto_close_time').html(rsp.result.trades_auto_close_time);
      $('.trades_auto_confirm_time').html(rsp.result.trades_auto_confirm_time);
      $('.trades_allow_refund_time').html(rsp.result.trades_allow_refund_time);
      $('#trades_auto_close_time').val(rsp.result.trades_auto_close_time);
      $('#trades_auto_confirm_time').val(rsp.result.trades_auto_confirm_time);
      $('#trades_allow_refund_time').val(rsp.result.trades_allow_refund_time);
    });
  });

  function timeList (time_type, time_value) {
    YBZF.services({
      'url': YBZF.hostname + '/site/setTradesAutoTime',
      'data': {
        'site_id': site_id,
        'time_type': time_type,
        'time_value': time_value
      },
      'type': 'post'
    }).done(function (rsp) {
      layer.msg(rsp.result.msg, function() {
        rsp.status && location.reload(true);  //刷新页面
      });
    });
  }

  $(document).on('click','.trades_auto_close_time',function () {
    var trades_auto_close_time = parseInt($('#trades_auto_close_time').val());
    if(isNaN(trades_auto_close_time)) {
      layer.msg('请输入数字!');
    } else if(trades_auto_close_time < 1 || trades_auto_close_time > 7) {
      layer.msg('请输入1-7范围的数字');
    } else {
      timeList('trades_auto_close_time',trades_auto_close_time);
    }
  });

  $(document).on('click','.trades_auto_confirm_time',function () {
    var trades_auto_confirm_time = parseInt($('#trades_auto_confirm_time').val());
    if(isNaN(trades_auto_confirm_time)) {
      layer.msg('请输入数字!');
    } else if(trades_auto_confirm_time < 1 || trades_auto_confirm_time > 15) {
      layer.msg('请输入1-15范围的数字');
    } else {
      timeList('trades_auto_confirm_time',trades_auto_confirm_time);
    }
  });

  $(document).on('click','.trades_allow_refund_time',function () {
    var trades_allow_refund_time = parseInt($('#trades_allow_refund_time').val());
    if(isNaN(trades_allow_refund_time)) {
      layer.msg('请输入数字!');
    } else if(trades_allow_refund_time < 1 || trades_allow_refund_time > 7) {
      layer.msg('请输入1-7范围的数字');
    } else {
      timeList('trades_allow_refund_time',trades_allow_refund_time);
    }
  });
/*
 {
   "status": true,
   "result": {
     "trades_auto_close_time": 3,
     "trades_auto_confirm_time": 15,
     "trades_allow_refund_time": 3
   }+
 }
 */
  $(document).on('click','#default',function () {
    YBZF.services({
      'url': YBZF.hostname + '/site/setTradesdefaultTime',
      'data': {
        'site_id':site_id
      },
      'type':'post'
    }).done(function(rsp) {
      $('.trades_auto_close_time').html(rsp.result.trades_auto_close_time);
      $('.trades_auto_confirm_time').html(rsp.result.trades_auto_confirm_time);
      $('.trades_allow_refund_time').html(rsp.result.trades_allow_refund_time);
      $('#trades_auto_close_time').val(rsp.result.trades_auto_close_time);
      $('#trades_auto_confirm_time').val(rsp.result.trades_auto_confirm_time);
      $('#trades_allow_refund_time').val(rsp.result.trades_allow_refund_time);
    });
  });

  /*$(document).on('click','deal-log',function () {
    YBZF.services({
      'url': YBZF.hostname + '/xx/xxx',
      'data': {
        'site_id':site_id
      },
      'type':'post'
    }).done(function(rsp) {

    })
  })*/

});
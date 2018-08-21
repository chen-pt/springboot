define(['common'], function(YBZF) {
  var __obj = {};

  __obj.init = function() {
    $(document).on('submit', '#check-form', function() {
      var data = $(this).serializeArray();
      var siteid = $('#site-id').val();
      if (! $.isNumeric(siteid)) {
        layer.msg('商家ID都没有，你想干啥?');
        return;
      }

      YBZF.services({
        'url': YBZF.hostname + '/account/getSummarizingData',
        'data': data
      }).done(function(rsp) {
        if (! rsp.status) {
          layer.msg(rsp.result.msg);
        } else {
          var html = $('#info-temp').html();
          var key = 'site_id_' + siteid;
          rsp.result[key].siteid = siteid;
          html = $.tmpl(html, rsp.result[key]);
          $('#shoping-info').empty().append(html).fadeIn('slow');
          $('#see').hide();
        }
      });
    });

    // 预结算按钮
    $(document).on('click', '#pre-settlement', settlementStatistical);

    $(function() {
      if ($.isNumeric($('#site-id').val())) {
        $('#check-form').trigger('submit');
      }
    });
    
  };

  // 预结算
  function settlementStatistical() {
    YBZF.services({
      'url': YBZF.hostname + '/account/settlementStatistical',
      'data': {
        'site-id': $('#site-info-id').val()
      }
    }).done(function(rsp) {
      if (! rsp.status) {
        layer.msg(rsp.result.msg);
      } else {
        // 跳转正式结算
        var $setp2 = $('.setp').removeClass('active').filter('[data-setp=2]');
        $('.sui-steps').find('.wrap .current').removeClass('current').end().find('.wrap:eq(1) .todo').removeClass('todo').addClass('current');
        $setp2.addClass('active');

        var html = $('#zs-info-temp').html();
        html = $.tmpl(html, rsp.result);
        $setp2.empty().append(html);
        
        // 正式结算按钮
        $(document).on('click', '#zs-settlement', (function() {
          var isHandle = false;
          return function () {
            if (isHandle) {
              layer.msg('正在结算，请勿重复提交');
              return;
            }

            if(rsp.result.did_not_check > 0) {
              layer.alert('您还有未对账的记录，请先对账后，再提交结算');
            } else if(rsp.result.transaction_records == 0) {
              layer.confirm('结算周期内没有产生交易，您确认继续结算吗？', function() {
                isHandle = true;
                settlementSummary(rsp.result.merchant_id).always(function(content, state) {
                  if (state != 'success' || (content && ! content.status) ) {
                    // 请求发生错误
                    isHandle = false;
                  }
                });
              });
            } else {
              isHandle = true;
              settlementSummary(rsp.result.merchant_id).always(function(content, state) {
                if (state != 'success' || (content && ! content.status) ) {
                  isHandle = false;
                }
              });
            }
          }
        }()));
      }
    });
  }

  // 正式结算
  function settlementSummary(merchant_id) {
    return YBZF.services({
      'url': YBZF.hostname + '/account/settlementSummary',
      'data': {
        'site-id': merchant_id
      }
    }).done(function(rsp) {
      if (! rsp.status) {
        layer.msg(rsp.result.msg);
      } else {
        // TODO 成功
        layer.msg(rsp.result.msg, function() {
          location.reload();
        });
      }
    });
  }

  return __obj;
});
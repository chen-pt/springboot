require(['common'], function(YBZF) {
  function getOrderDetail(tid) {
    YBZF.services({
      'url': YBZF.hostname + '/order/getOrderDetail',
      'data': {
        'tid': tid
      }
    }).done(function(rsp) {
      if(rsp.status) {
        var html = $.tmpl($('#detail-temp').html(), rsp);
        $('#trade-container').empty().append(html);
      } else {
        $('#trade-container').empty().append(rsp.result.msg);
      }
    });
  }

  // ready
  $(function() {
    var tid = $('#trade_id').val();
    getOrderDetail(tid);
  });
});
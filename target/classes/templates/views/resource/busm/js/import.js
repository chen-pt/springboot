require(['common', 'sui'], function(YBZF) {
  // 上传支付宝数据
  $(document).one('click', '.upload', function() {
    var call = arguments.callee;
    var type = $(this).data('type');
    var fileid = '#' + {'ali': 'ali-file', 'wx': 'wx-file', 'ali-refund': 'ali-refund-file', 'wx-refund': 'wx-refund-file'}[type];
    var files = document.querySelector(fileid).files;
    if( ! files.length ) {
      layer.msg('请选择上传的文件');
      return;
    }

    var data = new FormData();
    data.append('data-file', files[0]);
    data.append('type', type);

    YBZF.services({
      'url': YBZF.hostname + '/account/merge',
      'data': data,
      'processData': false,
      'contentType': false
    }).done(function(rsp) {
      layer.msg(rsp.result.msg);
    }).always(function() {
      $(document).one('click', '.upload', call);
    });
  });

  $(document).on('click', '#ok-account', function() {
    var html =
      '<div class="sui-msg msg-block msg-info msg-xlarge" style="font-size: 16px;line-height: 1.5;">' +
        '<div class="msg-con">' +
          '请确认同一时间段内的对账记录都导入成功：' +
          '<p class="red">*我已导入【支付宝】付款记录和退款记录</p>' +
          '<p class="red">*我已导入【微信】付款记录和退款记录</p>' +
        '</div>' +
        '<s class="msg-icon"></s>' +
      '</div>';

    layer.confirm(html, {area: '400px'}, function() {
      YBZF.services({
        'url': YBZF.hostname + '/account/okAccount'
      }).done(function(rsp) {
        layer.msg(rsp.result.msg);
      });
    });
  })
});
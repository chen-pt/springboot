require(['common'], function(YBZF) {
  function getTings() {
    // 获取设置值
    YBZF.services({
      'url': YBZF.hostname + '/goodssync/getTings'
    }).done(function(rsp) {
      if( rsp.status ) {
        $.each(rsp.result.items, function(k, v) {
          var $optele = $('[data-type=' + v.detail_tpl + ']');
          // 握了棵草
          $optele.find('.allowadd').prop('checked', !!+v.allow_add);
          $optele.find('.allowupdate').prop('checked', !!+v.allow_update);
        });
      }
    });
  }
  getTings();

  $(document).on('click', '#save-btn', function() {
    // 可以增加一个批量的方法
    var dfds = $('tr[data-type]').map(function() {
      // 模板标识
      var detail_tpl = $(this).data('type');
      var allow_add = +$(this).find('.allowadd').prop('checked');
      var allow_update = +$(this).find('.allowupdate').prop('checked');
      // 和设置字段页面方法相同
      return YBZF.services({
        'url': YBZF.hostname + '/goodssync/setTings',
        'data': {
          'detail_tpl': detail_tpl,
          'allow_add': allow_add,
          'allow_update': allow_update
        }
      });
    }).get();

    $.when.apply(null, dfds).done(function() {
      layer.msg('设置成功', function() {
        location.reload();
      });
    });
  });
});
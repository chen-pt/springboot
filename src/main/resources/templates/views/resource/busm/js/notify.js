require(['common', 'core/pagin', 'notify/publish'], function(YBZF, pagin, Notify) {
  // 搜索按钮
  $(document).on('submit', '#search-gg-form', function() {
    getList(1);
  });

  // 删除公告
  $(document).on('click', '.del-notify', function() {
    var id = $(this).data('id');
    layer.confirm('确定删除该公告吗?', function() {
      Notify.publish.del(id).done(function(rsp) {
        if(rsp.status) {
          layer.msg('删除成功', {'time': 3000}, function() {
            getList(1);
          });
        }
      });
    });
  });


  function getList(pageno) {
    var data = $('#search-gg-form').serializeArray();
    var pagesize = $('.page-size-sel').val() || 15;
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'name': 'pagesize', 'value': pagesize});
    YBZF.services({
      'url': YBZF.hostname + '/notify/getlist',
      'data': data
    }).done(function(rsp) {
      var html = $.tmpl($('#notify-row-temp').html(), rsp);
      $('#notify-list').empty().append(html);
      pagin('#pagin', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
    });
  }

  function publishing($form) {
    var data = $form.serializeArray();
    Notify.publish.send(data).done(function(rsp) {
      if(rsp.status) {
        layer.alert(rsp.result.msg, function(idx) {
          location.href = '/notify/list';
          layer.close(idx);
        });
      } else {
        layer.msg(rsp.result.msg);
      }
    });
  }

  // ready
  $(function() {
    switch(location.pathname) {
      case '/notify/list':
        getList(1);
        break;
      case '/notify/publish':
        Notify.publish.init({}, publishing);
    }
  });
});
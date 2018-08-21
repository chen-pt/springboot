require(['common', 'sui', 'core/pagin'], function(YBZF, __sui__, pagin) {

  // 搜索按钮
  $(document).on('click', '#search-refund-btn', function() {
    getList(1);
  });


  function getList(pageno) {
    var data = $('#search-form').serializeArray();
      var pagesize = $('.page-size-sel').val() || 15;
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'name': 'pagesize', 'value': pagesize});
    YBZF.services({
      'url': YBZF.hostname + '/refund/getlist',
      'data': data
    }).done(function(rsp) {
      var html = $.tmpl($('#refund-row-temp').html(), rsp);
      $('#refund-list').empty().append(html);
      pagin('#refund-pagin', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
    });
  }

  // ready
  $(function() {
    getList(1);
  });
});

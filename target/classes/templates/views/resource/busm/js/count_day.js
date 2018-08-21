require(['common','core/pagin','sui'], function(YBZF,pagin) {
  function getList (pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;

    var data = {};
    data.pageno = pageno;
    data.pagesize = pagesize;

    YBZF.services ({
      'url': YBZF.hostname + 'xxx',
      'data': data
    }).done(function (rsp) {
      if (rsp.status) {
        var html = $("#day-dot").html();
        html = $.tmpl(html, rsp.result);
        $("#day-pagin").empty().append(html);

        pagin('#pagination', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
      }
    })
  }
});
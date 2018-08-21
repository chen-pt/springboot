require(['common','core/pagin','sui'], function(YBZF,pagin) {
  function getList (pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;
    var merchant_id = $('#merchant_id').val();

    var data = {};
    data.pageno = pageno;
    data.pagesize = pagesize;
    data.merchant_id = merchant_id;

    YBZF.services ({
      'url': YBZF.hostname + 'xxx',
      'data': data
    }).done(function (rsp) {
      if (rsp.status) {
        var html = $("#record-dot").html();
        html = $.tmpl(html, rsp.result);
        $("#record-list").empty().append(html);

        pagin('#pagination', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
      }
    })
  }
});
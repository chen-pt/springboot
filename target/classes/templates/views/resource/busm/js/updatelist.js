require(['common', 'core/pagin', 'sui'], function(YBZF, pagin) {

  $("#search").on("click",function() {
    getList(1);
  });

  getList(1);

  function getList(pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;
    var type = $("#site_status").val();
    var info_sync_status = $("#update_status").val();
    var img_sync_status = $("#update_status2").val();
    var detail_tpl = $("#update_status3").val();
    var drug_name = $("#update_status4").val();
    var approval_number=$("#update_status5").val();

    YBZF.services({
      'url': YBZF.hostname + '/services/getUpdateList',
      'data': {
        'pageno': pageno,
        'pagesize': pagesize,
        'info_sync_status': info_sync_status,
        'img_sync_status': img_sync_status	,
        'detail_tpl': detail_tpl,
        'drug_name':drug_name,
        'approval_number':approval_number,
        'type': type,
        'update_spec':$('#update_spec').val(),
        'update_factory':$('#update_factory').val(),
        'update_business':$('#update_business').val(),
        'start_date':$('#start_date').val(),
        'end_date':$('#end_date').val(),
        'update_code':$('#update_code').val()
      }
    }).done(function (rsp) {
      if( rsp.status ) {
        var html = $("#shop-list-temp").html();
        html = $.tmpl(html, rsp.result);
        $("#goods-list").empty().append(html);

        pagin('#pagination', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);
      } else {
        // 没有数据
        $("#goods-list").empty().append("<tr>" + "<td colspan='9' style='text-align: center;' >" + "<div align='center' class='sui-msg msg-large msg-naked msg-error'>" +
        "<div class='msg-con'>没有查询到该状态下的数据</div>" + "<s class='msg-icon'></s>" + "</div>" + "</td>" + "</tr>");
      }
    });
  }
  //全选
  $(document).on('click', '#check-all', function() {
    if($(this).html().trim() == '全选') {
      $('.checkbox:not(:disabled)').prop('checked', true);
    } else {
      $('.checkbox:not(:disabled)').each(function() {
        this.checked = ! this.checked;
      });
    }
  });
  //批量删除
  $(document).on('click', '#delete-bat', function() {
    var $check = $(".checkbox:checked");
    if($('#site_status').val() == 0 && $('#site_status').val() != '') {
      layer.msg('已删除的商品不能再次删除');
    } else if($check.size() == 0) {
      layer.msg('未选中任何商品');
    } else {
      var id = $check.map(function () {
        return this.value;
      }).get().join(',');

      layer.confirm('总计' + $check.size() + '个商品，你确定删除吗?', function () {
        YBZF.services({
          'url': YBZF.hostname + '/goodssync/del',
          'data': {
            'id': id
          }
        }).done(function (rsp) {
          layer.msg(rsp.result.msg, function () {
            getList(1);
          });
        });
      });
    }
  });

});
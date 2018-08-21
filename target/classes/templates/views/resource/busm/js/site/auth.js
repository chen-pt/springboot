require(['common','core/pagin', 'sui'], function(YBZF,pagin,sui) {
  //选择提示框
  $(document).on('shown', '#Select-merchant', function() {
    $('#text-search').val('');
    getSiteList(1);
  });

  // 获取商家列表
  function getSiteList(pageno) {
    var pagesize = $('.page-size-sel').val() || 15;
    pageno = pageno || 1;
    var data = {};
    data.merchant_name = $('#text-search').val();
    data.pagesize = pagesize;
    data.pageno = pageno;
    YBZF.services({
      'url': YBZF.hostname + '/services/getSiteList',
      'data': data
    }).done(function (rsp) {
      if (rsp.status) {
        var html = $('#power-tod').html();
        html = $.tmpl(html, rsp);
        $('#goods-list').empty().append(html);

        pagin('#power-pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getSiteList);
      } else {
        layer.msg(rsp.result.msg);
        $('#goods-list').empty();
        $('#power-pagein').empty();
      }
    });
  }

  //搜索
  $(document).on('click','.search',function() {
    getSiteList();
  });

  // 选择指定商家  id
  $(document).on('click','.confirm', function () {
    $('#power-reason').val('');
    var merchant_name = $(this).attr('name');
    var merchant_id = $(this).attr('id');
    // 设置选择商家名称  id
    $('#merchant_name').val(merchant_id + ":" + merchant_name);
    $('#merchant_id').val(merchant_id);
  });

  //通用授权码
  $(document).on('click','.power-all', function () {
    // 设置选择商家名称  id
    $('#merchant_name').val('通用');
    $('#merchant_id').val(0);
    $('#power-reason').val('');
  });

  // 生成授权码
  $(document).on('submit', '#power-form', function () {
    var data = $(this).serializeArray();
    if ($('#merchant_id').val() == '') {
      layer.msg('请选择商家!');
      return;
    }else if($('#power-reason').val() == '') {
      layer.msg('申请原因不能为空!');
      return;
    }

    YBZF.services({
      'url' : YBZF.hostname + '/permission/addSiteAuth',
      'data':data
    }).done(function (rsp) {
      if(rsp.status) {
        $('.produce-tr').show();
        $('.power-code').html(rsp.result.auth_code);
        $('.power-date').html(rsp.result.end_time);
        $('.power-remove').data('result-id', rsp.result.id);
      } else {
        layer.msg(rsp.result.msg);
      }
    })
  });

  //删除授权码
  $(document).on('click','.power-remove', function () {
    YBZF.services({
      'url' : YBZF.hostname + '/permission/disableAuth',
      'data': {
        auth_id: $('.power-remove').data('result-id')
      }
    }).done(function (rsp) {
      layer.msg(rsp.result.msg);
      if(rsp.status) {
        $('.power-code').html('已禁用！');
      }
    })
  });
});
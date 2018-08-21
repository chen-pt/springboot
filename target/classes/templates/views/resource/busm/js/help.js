require(['common', 'sui', 'core/pagin'], function(YBZF, __sui, pagin) {
  // 获取文档列表
  function getList(pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;
    YBZF.services({
      'url': YBZF.hostname + '/help/getList',
      'data': {
        'pageno': pageno,
        'pagesoze': pagesize
      }
    }).done(function(rsp) {
      console.log(rsp);
      var html = $('#row-temp').html();
      html = $.tmpl(html, rsp);
      var $fileList = $('#file-list');
      $fileList.empty().append(html);
      pagin('#pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList);

      // 将记录记录在元素上面
      if( rsp.status && rsp.result.items.length ) {
        $.each(rsp.result.items, function(idx) {
          $fileList.find('tr').eq(idx).data('record', {'datas': this});
        });
      }
    });
  }

  // 删除
  $(document).on('click', '.del-doc', function() {
    var id = $(this).parents('tr').data('record').datas.id;

    layer.confirm('你确定删除该记录吗？', function() {
      YBZF.services({
        'url': YBZF.hostname + '/help/deldoc',
        'data': {
          'id': id
        }
      }).done(function(rsp) {
        if (rsp.status) {
          layer.msg('删除成功');
          getList(1);
        } else {
          layer.msg(rsp.result.msg);
        }
      });
    });
  });

  // 添加按钮
  $(document).on('click', '#add-doc', function() {
    // 重置表单
    $('#upload-form')[0].reset();
  });

  // 编辑文档
  $(document).on('click', '.edit-doc', function() {
    var data = $(this).parents('tr').data('record').datas;

    // 重置表单
    $('#upload-form')[0].reset();

    // 设置值
    $('#file-name').val(data.title);
    $('#version').val(data.version);
    $('#doc-id').val(data.id);

    // 显示对话框
    $('#myModal').modal('show');
  });



  $(document).on('')




  // ready
  $(function() {
    getList();

    // 增加验证规则
    $.validate.setRule('version', function(value, $element, param) {
      return /^v(\d+\.){1,4}\d+\w?$/.test(value);
    }, '请输入正确的版本号');

    $('#upload-form').validate({
      'success': function($form) {
        var data = new FormData($form[0]);

        YBZF.services({
          'url': YBZF.hostname + '/help/upload',
          'type': 'post',
          'data': data,
          'dataType': 'json',
          'contentType': false,
          'processData': false
        }).done(function(rsp) {

          if (rsp.status) {
            layer.msg(rsp.result.msg, {'time': 3000}, function() {
              $('#myModal').modal('hide');
              getList(1);
            });
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      }
    });
  });
});
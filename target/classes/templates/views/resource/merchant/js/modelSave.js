/**
 * Created by admin on 2017/3/29.
 */

  $(document).on('click', '#save-btn', function() {
    // 可以增加一个批量的方法
    var dfds = $('tr[data-type]').map(function() {
      // 模板标识
      var detail_tpl = $(this).data('type');
      var allow_add = +$(this).find('.allowadd').prop('checked');
      var allow_update = +$(this).find('.allowupdate').prop('checked');
      // 和设置字段页面方法相同
      $.ajax({
        type: 'post',
        url: '/jk51b/goods/modelSave',
        data: {
          'detail_tpl': detail_tpl,

          'allow_add': allow_add,
          'allow_update': allow_update
        }
      });
    }).get();
      $.when.apply(null, dfds).done(function() {
        layer.msg('设置成功', function() {
          window.location.href = "/jk51b/goods/update";
        });
      });
    });










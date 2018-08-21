require(['common', 'user/UserManager'], function(YBZF) {
  // 添加/编辑用户
  $(function() {
    $('#edit-user-form').validate({
      'success': function($form) {
        var data = $form.serializeArray();
        YBZF.services({
          'url': $form[0].action,
          'data': data
        }).done(function(rsp) {
          layer.msg(rsp.result.msg, {time: 3000}, function() {
            if(rsp.status) {
              location.pathname = '/user/list';
            }
          });
        });

        return false;
      }
    });
  });

});
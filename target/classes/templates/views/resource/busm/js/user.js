require([
  'common',
  'user/UserManager',
  'user/RoleManager',
  'sui'
], function(YBZF, UserManager, RoleManager,pagin, __xx_sui) {

  // 用户列表搜索按钮
  $(document).on('click', '#user-search-btn', function() {
    UserManager.getList(1);
  });

  // 角色列表搜索按钮
  $(document).on('click', '#role-search-btn', function() {
    RoleManager.getList(1);
  });

  window.onhashchange = function() {
    var hash = location.hash.substr(1);

    if( hash ) {
      $('a[href=#' + hash + ']').tab('show');
    }
  };

  // 切换tab
  $(document).on('shown', '#toggle-tab', function(evt) {
    var target = evt.target.hash.substr(1);
    switch(target) {
      case 'user-pane':
        location.hash = '#user-pane';
        UserManager.getList(1);
        break;
      case 'role-pane':
        location.hash = '#role-pane';
        RoleManager.getList(1);
        break;
    }
  });

  $(function() {
    UserManager.setConfig({
      'pageContainer': '#user-pagin'
    });

    RoleManager.setConfig({
      'pageContainer': '#role-pagin'
    });

    var active = location.hash || '#user-pane';
    $('a[href=' + active + ']').tab('show');
  });

  // 添加/编辑角色
  $(document).on('click', '#add-role-btn,.edit-role', function() {
    if( $(this).parents('tr').size() ) {
      var data = $(this).parents('tr').data('tree').datas;
    } else {
      data = {};
    }

    var html = $.tmpl($('#add-role-temp').html(), data);
    $.alert({
      'backdrop': 'static',
      'width': 'small',
      'title': '添加/编辑角色',
      'hasfoot': true,
      'okBtn': '添加',
      'cancelBtn': '取消',
      'body': html,
      'okHide': function() {
        var data = $('#edit-role-form').serializeArray();
        var $modal = this;

        RoleManager.edit(data).done(function(rsp) {
          if(rsp.status) {
            layer.msg('操作成功');
            // 关闭对话框
            $modal.$element.modal('hide');
            RoleManager.getList(1);
          } else {
            layer.msg(rsp.result.msg);
          }
        });

        return false;
      }
    });
  });

  // 给角色设置权限对话框
  $(document).on('click', '.set-permission', function() {
    var record = $(this).parents('tr').data('tree').datas;
    // 获取模块
    var permission_dfd = YBZF.services({
      'url': YBZF.hostname + '/permission/getPermissionList',
      'data': {
        'pageno': 1,
        'pagesize': 100,
        'permission-platform': 110
      }
    });

    var module_dfd = YBZF.services({
      'url': YBZF.hostname + '/permission/getPermissionTypeList',
      'data': {
        'module-platform': 110
      }
    });

    $.when(permission_dfd, module_dfd).done(function(permissionResponse, moduleResponse) {
      var permission = permissionResponse[0];
      var module = moduleResponse[0];
      if(permission.status && permission.result.items.length && module.status && module.result.items.length) {
        permission = permission.result.items;
        module = module.result.items;

        // 将权限 添加到对应的模块下面去
        $(permission).each(function(idx, p) {
          $(module).each(function(k, m) {
            if(p.type_id == m.id) {
              // 找到对应的模块
              if(module[k].permissions) {
                module[k].permissions.push(p);
              } else {
                module[k].permissions = [p];
              }
            }
          });
        });

        var html = $.tmpl($('#set-permission-temp').html(), {'record': record, 'module': module});
        var $modal = $.alert({
          'backdrop': 'static',
          'width': 'normal',
          'title': '设置权限',
          'hasfoot': false,
          'body': html
        });

        // 选中已经设置了的
        $(record.permissions).each(function(k, v) {
          $('[value="' + v + '"]').click();
        });

        // 保存角色权限设置
        $modal.on('click', '#save-permission-btn', function() {
          var data = $('#set-permission-form').serializeArray();
          RoleManager.edit(data).done(function(rsp) {
            if(rsp.status) {
              layer.msg('操作成功');
              // 关闭对话框
              $modal.modal('hide');
              RoleManager.getList(1);
            } else {
              layer.msg(rsp.result.msg);
            }
          });
        });
      } else {
        layer.msg('获取权限失败');
      }
    }).fail(function() {
      layer.msg('获取权限失败!');
    });
  });

  // 删除角色
  $(document).on('click', '.del-role', function() {
    var role_id = $(this).parents('tr').data('tree').datas.id;
    layer.confirm('您确定删除该角色吗？提示：该角色内的所有权限和用户将同时被移除。', function() {
      RoleManager.drop(role_id).done(function(rsp) {
        layer.msg(rsp.result.msg || '删除失败');
        if(rsp.status) {
          // 删除成功 刷新下列表
          RoleManager.getList(1);
        }
      });
    });
  });

  // 选中模块 将所有权限选中
  $(document).on('click', '.permission-group-label', function() {
    var $groupInput = $(this).find('input');
    $('#permission-group-' + $groupInput.val()).find('input:checkbox').prop('checked', $groupInput[0].checked);
  });

  // 选中权限
  $(document).on('click', '.permission-label', function() {
    var $parents = $(this).parents('td');
    if($parents.find('input').size() == $parents.find('input:checked').size()) {
      $(this).parents('td').siblings('td').find('.permission-group-label input').prop('checked', true);
    } else {
      $(this).parents('td').siblings('td').find('.permission-group-label input').prop('checked', false);
    }
  });

  // 设置角色内的用户
  $(document).on('click', '.set-user', function() {
    var record = $(this).parents('tr').data('tree').datas;
    // 获取所有用户
    YBZF.services({
      'url': YBZF.hostname + '/user/getManagerList',
      'data': {
        'pageno': 1,
        'pagesize': 1000
      }
    }).done(function(rsp) {
      if(! rsp.status) {
        layer.msg('获取用户列表失败!');
        return false;
      }

      var html = $.tmpl($('#set-user-temp').html(), {'record': record, 'userList': rsp.result.items});
      var $modal = $.alert({
        'backdrop': 'static',
        'width': 'normal',
        'title': '设置用户',
        'hasfoot': false,
        'body': html
      });

      // 选中已经设置了的
      $(record.managers).each(function(k, v) {
        $('[value="' + v.manager_id + '"]').click();
      });

      // 保存角色用户
      $modal.on('click', '#save-user-btn', function() {
        var data = $('#set-user-form').serializeArray();
        RoleManager.setUser(data).done(function(rsp) {
          if(rsp.status) {
            layer.msg('操作成功');
            // 关闭对话框
            $modal.modal('hide');
            RoleManager.getList(1);
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });
    }).fail(function() {
      layer.alert('当前网络似乎有点问题', {icon: 8});
    });
  });

  // 查看用户信息
  $(document).on('click', '.cat-user', function() {
    var record = $(this).parents('tr').data('tree').datas;
    var html = $.tmpl($('#cat-user-temp').html(), record);
    $.alert({
      'backdrop': 'static',
      'width': 'normal',
      'title': '用户信息',
      'hasfoot': true,
      'okBtn': '确定',
      'body': html
    });
  });
});
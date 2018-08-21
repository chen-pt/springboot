require.config({
  paths:{
    'core':'../lovejs/core',
    'tools':'../lovejs/tools',
    'permission': 'service/permission'
  }
});
/**
 * 初始化
 */
$(function () {
  require(['core'], function (core)
  {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();

  });

  /**
   * 路由
   * @type {string}
   */
  var url =  window.location.pathname;

  switch (url)
  {
    case '/permission/index':
      //用户列表
      initUser();
      break;
    case '/permission/role':
      //角色管理
      initRole();
      break;
    case '/permission/editUser':
      // 编辑用户
      initEditUser();
      break;
    case '/permission/perationLog':
      // 日志统计
      initLog();
      break;
    case '/permission/authcode':
      //授权码
      initAuthCode();
  }
});

/**
 * 用户列表
 */
function initUser() {
  require(['permission'], function(permission) {
    permission.User.getList(1);

    // 搜索
    $(document).on('click', '#user-search-btn', function() {
      permission.User.getList(1);
    });
  });
}

function initRole() {
  var RoleManager, permission;
  require(['permission'], function(ps) {
    permission = ps;
    permission.Role.getList(1);
    RoleManager = permission.Role;
  });

  // 搜索
  $(document).on('click', '#role-search-btn', function() {
    permission.Role.getList(1);
  });

  // 添加/编辑角色
  $(document).on('click', '#add-role-btn,.edit-role', function() {
    if( $(this).parents('tr').size() ) {
      var data = $(this).parents('tr').data('tree').datas;
    } else {
      data = {};
    }

    var html = doT.template($('#add-role-temp').html())(data);
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

        if (! $('#role-name').val().trim()) {
          layer.msg('角色名称不能为空');
          return;
        }

        RoleManager.edit(data).done(function(rsp) {
          if(rsp.status) {
            alert('操作成功');
            // 关闭对话框
            $modal.$element.modal('hide');
            RoleManager.getList(1);
          } else {
            alert(rsp.result.msg);
          }
        });

        return false;
      }
    });
  });

  // 设置权限
  $(document).on('click', '.set-permission', function() {
    var record = $(this).parents('tr').data('tree').datas;
    // 获取模块
    var permission_dfd = permission.getPermissionList();

    var module_dfd = permission.getPermissionTypeList();
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

        var html = doT.template($('#set-permission-temp').html())({'record': record, 'module': module});
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
              alert('操作成功');
              // 关闭对话框
              $modal.modal('hide');
              RoleManager.getList(1);
            } else {
              alert(rsp.result.msg);
            }
          });
        });
      } else {
        alert('获取权限失败');
      }
    }).fail(function() {
      alert('获取权限失败!');
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
    permission.getStoreAdminList().done(function(rsp) {
      if(! rsp.status) {
        layer.msg('获取用户列表失败!');
        return false;
      }

      var html = doT.template($('#set-user-temp').html())({'record': record, 'userList': rsp.result.items});
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
            alert('操作成功');
            // 关闭对话框
            $modal.modal('hide');
            RoleManager.getList(1);
          } else {
            alert(rsp.result.msg);
          }
        });
      });
    }).fail(function() {
      alert('当前网络似乎有点问题', {icon: 8});
    });
  });

  // 删除角色
  $(document).on('click', '.del-role', function() {
    var role_id = $(this).parents('tr').data('tree').datas.id;

    if(confirm('您确定删除该角色吗？提示：该角色内的所有权限和用户将同时被移除。')) {
      RoleManager.drop(role_id).done(function(rsp) {
        alert(rsp.result.msg || '删除失败');
        if(rsp.status) {
          // 删除成功 刷新下列表
          RoleManager.getList(1);
        }
      });
    }
  });
}

// 编辑用户
function initEditUser() {
  $(function() {
    $('#edit-user-form').validate({
      'success': function($form) {
        var data = $form.serializeArray();
        $.ajax({
          'url': $form[0].action,
          'data': data,
          'type': 'post',
          'dataType': 'json'
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
}

/**
 * 日志
 */
function initLog() {
  require(['permission'], function(permission) {
    getList(1);

    $(document).on('click', '#log-search-btn', function() {
      getList(1);
    });

    function getList(pageno) {
      pageno = pageno || 1;
      permission.getLogList(pageno);
    }
  });
}

/**
 * 授权码
 */
function initAuthCode() {
  require(['permission'], function(permission) {
    $(function() {
      $('#auth-code-form').validate({
        'success': function($form) {
          permission.setAuthCode($form.serializeArray()).done(function(rsp) {
            if (rsp.status) {
              $form[0].reset();
            }
          });
        }
      });
    });
  });

}

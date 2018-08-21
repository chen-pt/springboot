require(['common','core/pagin' ,'sui'], function(YBZF,pagin,sui) {
  $(document).on("click", ".sui-dropdown-menu a", function() {
    var $target = $(this),
        $li = $target.parent(),
        $container = $target.parents(".sui-dropdown, .sui-dropup"),
        $menu = $container.find("[role='menu']");
    if($li.is(".disabled, :disabled")) return;
    if ($container.is('.disabled, :disabled')) return;
    $container.find("input").val($target.attr("value") || "").trigger("change");
    $container.find('[data-toggle=dropdown] span').html($target.text());
    $menu.find(".active").removeClass("active");
    $li.addClass("active");
    $li.parents('[role=presentation]').addClass('active');
  });

  var permission = {
    'getList': function(pageno) {
        var pagesize = $('.page-size-sel').val() || 15;
      pageno = $.isNumeric(pageno) ? pageno : 1;
      var data = $('#permission').find('.sui-form').serializeArray();
      data.push({'name': 'pageno', 'value': pageno});
      data.push({'name': 'pagesize', 'value': pagesize});
      YBZF.services({
        'url': YBZF.hostname + '/permission/getPermissionList',
        'data': data
      }).done(function(rsp) {
        var html = $('#permission-template').html();
        html = $.tmpl(html, rsp);
        $('#permission-list').empty().append(html);

        pagin('#permission-pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, permission.getList);
      });
    },
    'edit': function(type) {
      if( type ) {
        var data = decodeURIComponent($(this).siblings('.hide-permission-data').val());
        var title = '编辑权限';
        var action = 'updatePermission';
        data = $.parseJSON(data);
      } else {
        data = {};
        title = '添加权限';
        action = 'addPermission';
      }

      var html = $.tmpl($('#edit-permission-template').html(), data);

      var $modal = $.alert({
        'backdrop': 'static',
        'width': 'small',
        'title': title,
        'hasfoot': false,
        'body': html
      });

      $modal.on('click', '.modify-module', function() {
        var data = $modal.find('.sui-form').serializeArray();
        YBZF.services({
          'url': YBZF.hostname + '/permission/' + action,
          'data': data
        }).done(function(rsp) {
          if( rsp.status ) {
            layer.msg( rsp.result.msg, function() {
              permission.getList();
            });
            $modal.modal('hide');
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });

      if(data.type_id) {
        // 如果是修改 选择模块
        $('li[role=presentation] a[role=menuitem][value=' + data.type_id + ']').click();
      }

      // 跳转到模块管理 关闭弹层
      $modal.on('click', '.goto-module', function() {
        $modal.modal('hide');
      });
    },
    'del': function() {
      var self = this;
      layer.confirm('确认删除该记录吗', {icon: 4, title: '温馨提示'}, function(index) {
        YBZF.services({
          'url': YBZF.hostname + '/permission/deletePermission',
          'data': {
            'id': $(self).data('id')
          }
        }).done(function(rsp) {
          if( rsp.status ) {
            layer.msg( rsp.result.msg, function() {
              permission.getList();
            });
            layer.close(index);
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });
    }
  };

  var module = {
    'getList': function(pageno) {
      var pagesize = $('.page-size-sel').val() || 15;
      pageno = $.isNumeric(pageno) ? pageno : 1;
      var data = $('#module').find('.sui-form').serializeArray();
      data.push({'name': 'pagesize', 'value': pagesize});
      YBZF.services({
        'url': YBZF.hostname + '/permission/getPermissionTypeList',
        'data': data
      }).done(function(rsp) {
        var html = $('#module-template').html();
        html = $.tmpl(html, rsp);
        $('#module-list').empty().append(html);

        pagin('#module-pagein', pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, permission.getList);
      });
    },
    'edit': function(type) {
      if( type ) {
        var data = decodeURIComponent($(this).siblings('.hide-module-data').val());
        var title = '编辑模块';
        var action = 'updatePermissionType';
        data = $.parseJSON(data);
      } else {
        data = {};
        title = '添加模块';
        action = 'addPermissionType';
      }

      var html = $.tmpl($('#edit-module-template').html(), data);
      var $modal = $.alert({
        'backdrop': 'static',
        'width': 'small',
        'title': title,
        'hasfoot': false,
        'body': html
      });

      $modal.on('click', '.modify-module', function() {
        var data = $modal.find('.sui-form').serializeArray();
        YBZF.services({
          'url': YBZF.hostname + '/permission/' + action,
          'data': data
        }).done(function(rsp) {
          if( rsp.status ) {
            layer.msg( rsp.result.msg, function() {
              //module.getList();
              location.search = 't=' + $.now();
            });
            $modal.modal('hide');
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });
    },
    'del': function() {
      var self = this;
      layer.confirm('确认删除该模块吗', {icon: 4, title: '温馨提示'}, function(index) {
        YBZF.services({
          'url': YBZF.hostname + '/permission/deletePermissionType',
          'data': {
            'id': $(self).data('id')
          }
        }).done(function(rsp) {
          if( rsp.status ) {
            layer.msg( rsp.result.msg, function() {
              location.search = 't=' + $.now();
            });
            layer.close(index);
          } else {
            layer.msg(rsp.result.msg);
          }
        });
      });
    }
  };

  // 切换tab
  $(document).on('shown', '#toggle-tab', function(evt) {
    var target = evt.target.hash.substr(1);
    switch(target) {
      case 'permission':
        location.hash = '#permission';
        $('[name=permission-platform]').trigger('change');
        permission.getList();
        break;
      case 'module':
        location.hash = '#module';
        module.getList();
        break;
    }
  });

  // 编辑模块
  $(document).on('click', '.edit-module', function() {
    module.edit.call(this, 1);
  });

  // 删除模块
  $(document).on('click', '.del-module', module.del);

  // 添加模块
  $(document).on('click', '#add-module', function() {
    module.edit.call(this, 0);
  });

  // 编辑模块
  $(document).on('click', '.edit-permission', function() {
    permission.edit.call(this, 1);
  });

  // 删除模块
  $(document).on('click', '.del-permission', permission.del);

  // 添加权限
  $(document).on('click', '#add-permission', function() {
    permission.edit.call(this, 0);

  });

  // 搜索
  $(document).on('click', '.module-search', module.getList);
  $(document).on('click', '.permission-search', permission.getList);

  // 根据平台选择模块
  $(document).on('change', '[name=permission-platform]', function() {
    YBZF.services({
      'url': YBZF.hostname + '/permission/getPermissionTypeList',
      'data': {
        'module-platform': this.value
      }
    }).done(function(rsp) {
      if(rsp) {
        var $typeSelect = $('[name=type_id]').empty().append('<option>请选择</option>');
      }

      if(rsp.status && rsp.result.items) {
        $(rsp.result.items).each(function(k, v) {
          $typeSelect.append('<option value="' + v.id + '">' + v.name + '</option>');
        });
      }
    });
  });

  window.onhashchange = function() {
    var hash = location.hash.substr(1);

    if( hash ) {
      $('a[href=#' + hash + ']').tab('show');
    }
  };

  $(function() {
    var active = location.hash || '#permission';
    $('a[href=' + active + ']').tab('show');
  });
});
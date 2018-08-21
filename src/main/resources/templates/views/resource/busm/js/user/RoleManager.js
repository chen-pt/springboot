define(['common', 'pagin'], function (YBZF, pagin) {
  'use strict';

  var __obj = {};
  // 默认配置项
  var config = {
    'pageContainer': '#pagin',
    'dataContainer': '#role-list',
    'dataTemp': '#role-row-temp'
  };

  // 修改配置
  __obj.setConfig = function (c) {
    config = $.extend(config, c);
  };

  __obj.getList = function (pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;
    var data = $('#search-role-form').serializeArray();
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'pagesize': 'pagesize', 'value': pagesize});

    YBZF.services({
      'url': YBZF.hostname + '/role/getlist',
      'data': data
    }).done(function (rsp) {
      rsp.getManagerNames = getManagerNames;
      var html = $.tmpl($(config.dataTemp).html(), rsp);
      var $dataContainer = $(config.dataContainer);
      $dataContainer.empty().append(html);

      if (rsp.status && rsp.result.items) {
        // 将数据绑定到视图
        $(rsp.result.items).each(function (idx) {
          $dataContainer.find('tr').eq(idx).data('tree', {'datas': this});
        });
      }

      pagin(config.pageContainer, pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, __obj.getList);
    });
  };

  // 添加/修改
  __obj.edit = function (data) {
    return YBZF.services({
      'url': YBZF.hostname + '/role/editRole',
      'data': data
    });
  };

  // 删除
  __obj.drop = function (role_id) {
    return YBZF.services({
      'url': YBZF.hostname + '/role/dropRole',
      'data': {
        'role_id': role_id
      }
    });
  };

  // 设置用户
  __obj.setUser = function (data) {
    return YBZF.services({
      'url': YBZF.hostname + '/role/storeRoleManagers',
      'data': data
    });
  };

  // 获取用户名
  function getManagerNames(users) {
    return $(users).map(function (k, v) {
      return v.manager.username;
    }).get().join(',');
  }

  return __obj;
});

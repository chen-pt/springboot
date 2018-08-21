define(['common', 'pagin'], function(YBZF, pagin) {
  'use strict';

  var __obj = {};
  // 默认配置项
  var config = {
    'pageContainer': '#pagin',
    'dataContainer': '#user-list',
    'dataTemp': '#user-row-temp'
  };

  // 修改配置
  __obj.setConfig = function(c) {
    config = $.extend(config, c);
  };

  // 分页获取数据
  __obj.getList = function(pageno) {
    pageno = pageno || 1;
    var pagesize = $('.page-size-sel').val() || 15;

    var data = $('#search-user-form').serializeArray();
    data.push({'name': 'pageno', 'value': pageno});
    data.push({'pagesize': 'pageno', 'value': pagesize});

    YBZF.services({
      'url': YBZF.hostname + '/user/getManagerList',
      'data': data
    }).done(function(rsp) {
      rsp.getRoleNames = getRoleNames;
      var html = $.tmpl($(config.dataTemp).html(), rsp);
      var $dataContainer = $(config.dataContainer);
      $dataContainer.empty().append(html);

      if(rsp.status && rsp.result.items) {
        // 将数据绑定到视图
        $(rsp.result.items).each(function(idx) {
          $dataContainer.find('tr').eq(idx).data('tree', {'datas': this});
        });
      }

      pagin(config.pageContainer, pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, __obj.getList);
    });
  };

  function getRoleNames(roles) {
    return $(roles).map(function(k, v) {
      return v.name;
    }).get().join(',');
  }

  return __obj;
});
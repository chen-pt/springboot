!(function() {
  'use strict';
  // 服务接口
  var __obj = {};

  // 服务地址
  __obj.hostname = (location.origin || location.protocol + '//' + location.hostname + (location.port == 80 ? '' : ':' + location.port));

  define(['jquery', 'layer'], function($) {
    services.call(__obj);
    return __obj;
  });

  // 添加方法
  function services() {
    this.services = function(api, data) {
      // region 参数
      var options = {
        'type': 'post',
        'dataType': 'json',
        'dataFilter': function (data) {
          if (data && data !== 'null') {
            var dataJson = JSON.parse(data);
            if (dataJson.status === 'ok') {
              dataJson.status = true;
            }

            if (dataJson.results) {
              dataJson.result = dataJson.results;
              delete dataJson.results;
            }

            data = JSON.stringify(dataJson);
          } else {
            data = '{"status": false, "result": {"msg": "未知错误"}}';
          }

          return data;
        },
      };

      if (api instanceof Object) {
        options = $.extend(options, api);
      } else {
        options.url = api;
        options.data = data;
      }

      if (/^\/[\S\s]*/.test(options.url) && !/^\/jk51b\/[\S\s]*/.test(options.url)) {
        options.url = __obj.hostname + '/jk51b' + options.url;
      }

      // options.url.test(//)

      // endregion
      layer.load(1, {time: 10 * 1000});

      return $.ajax(options).done(function(rsp) {
        layer.closeAll && layer.closeAll();
        if(! rsp.status) {
          if(rsp.result.code === 302) {
            location.reload();
          } else if(rsp.result.code === 403) {
            layer.confirm('这是一个悲伤的故事，你没有操作该功能的权限，联系管理员申请吧');
          }
        }

      }).fail(function() {
      });
    };
  }
})();

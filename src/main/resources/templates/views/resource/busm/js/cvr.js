require(['common', 'vue', 'pagin', 'sui'], function(YBZF, Vue, pagin) {
  Vue.config.delimiters = ["<%=", "%>"];
  Vue.config.unsafeDelimiters = ["<%%=", "%%>"];
  // 列表
  var listConfig = (function() {
    var config = {
      'template': '#site-list-temp',
      'replace': false
    };

    // 事件
    config.filters = {
      'pay_style': function(val) {
        if (val === 'wx' || val === 'wx_jsapi' || val === 'wx_JSAPI' ) {
          return '微信';
        } else if(val === 'ali'){
          return '支付宝';
        } else if(val === 'bi'){
          return '快钱';
        } else if(val === 'health_insurance'){
          return '医保卡';
        } else if(val === 'cash'){
          return '现金';
        } else if(val.toLowerCase() == 'unionpay') {
          return '银联';
        }

        return 'unknow';
      }
    };

    config.props = {
      'rsp': {
        'type': Object,
        'default': function() {
          return {};
        }
      }
    };

    config.components = {
      'show-ids': {
        'template': '#show-ids-template',
        'props': ['ids'],
        'filters': {
          'format_ids': function (value) {
            // 下面使用了splice方法会触发视图的更新 将Vue封装过的数据转换为原生数组
            var ids = [];
            ids.push.apply(ids, value);

            var text = '', t = [];

            do {
              t = ids.splice(0, 5);
              text += t.join(',&nbsp;') + '<br>';
            } while(ids.length);

            return text;
          }
        }
      }
    };

    return config;
  })();

  // 表单
  var searchFormConfig = (function() {
    var fields = {};
    $('#search-form').serializeArray().forEach(function(v) {
      fields[v.name] = v.value;
    });

    fields.pageno = 1;
    fields.pagesize = 15;

    return {
      'replace': false,
      'data': function() {
        return fields;
      }
    };

    // config.props = {};

    // return config;
  })();

  var config = (function() {
    /**
     * 获取商家列表
     */
    function getList(pageno) {
      var self = this;
      var searchForm = this.$refs.searchForm;
      searchForm.$data.pageno = pageno || 1;
      var pagesize = $('.page-size-sel').val() || 15;
      searchForm.pagesize = pagesize;
      var data = JSON.parse(JSON.stringify(searchForm.$data));

      YBZF.services({
        'url': YBZF.hostname + '/account/getDifflist',
        'data': data
      }).done(function (rsp) {
        // self.$broadcast('list-data', rsp);
        self.$data.listResponse = rsp;
        var $pagin = $('#pagination');
        if (rsp.status) {
          pagin($pagin, pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList.bind(self));
          if (rsp.status && rsp.result.total_items < 1001) {
            var tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total_items + '</span>条，<a href="/export/accountDiff?type=1&' + $.param(data) + '"">点击下载</a>';
          } else {
            tipsHtml = '本次查询结果<span style="color: red">' + rsp.result.total_items + '</span>条，已超过1000条的最大值<br />请修改查询条件，分批次下载。';
          }

          $('#result-tips').empty().append(tipsHtml);
          $pagin.show();
        } else {
          $pagin.hide();
        }
      });
    }

    var defaultData = {
      'listResponse': {}
    };

    var config = {
      'el': '#site-list-component',
      'methods': {
        'getList': getList
      },
      'data': function() {
        return defaultData;
      }
    };

    config.components = {
      'site-list': listConfig,
      'search-form': searchFormConfig
    };

    config.ready = function (pageno) {
      getList.call(this, pageno);
    };

    return config;
  })();

  new Vue(config);
});
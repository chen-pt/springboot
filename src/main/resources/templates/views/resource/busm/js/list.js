require(['common', 'core/pagin', 'vue', 'sui'], function(YBZF, pagin, Vue) {
  Vue.config.delimiters = ["<%=", "%>"];
  // 列表
  var listConfig = (function() {
    var filters = {
      'cycle': function(value) {
        var dict = {'1': '(按周)', '2': '(按月)', '130': '3', '3': '(按日)'};

        return dict[value] ? dict[value] : '';
      },
      'dict_site_status': function(value) {
        var dict = {'110': '审核中', '120': '试运行', '130': '正常运行', '999': '封网'};

        return dict[value] ? dict[value] : 'unknow';
      }
    };

    var config = {
      'template': '#site-list-temp',
      'replace': false
    };

    // 过滤器
    config.filters = filters;

    config.props = {
      'rsp': {
        'type': Object,
        'default': function() {
          return {};
        }
      }
    };

    return config;
  })();

  // 表单
  var searchFormConfig = (function() {
    // 生成指定范围数字
    function range(min, max) {
      var arr = [];
      while (min <= max) {
        arr.push(min++);
      }

      return arr;
    }

    var defaultData = {
      'set_type': '',
      'site_status': '',
      'merchant_name': '',
      'merchant_id': '',
      'create_time_start': '',
      'create_time_end': '',
      'set_value_start': '',
      'set_value_end': '',
      'pageno': 1,
      'pagesize': 15
    };

    var config = {
      'replace': false,
      'data': function() {
        return defaultData;
      }
    };

    // 合同计算周期
    config.computed = {
      'set_value_days_start': function() {
        var valueMax = (this.set_type == 1 ? 7 : 28);
        this.set_value_start = 1;

        return range(1, valueMax);
      },
      'set_value_days_end': function() {
        var valueMax = (this.set_type == 1 ? 7 : 28);
        var valueMin = this.set_value_start ? this.set_value_start : 1;
        this.set_value_end = valueMin;

        return range(valueMin, valueMax);
      }
    };

    return config;
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
        'url': YBZF.hostname + '/services/getSiteList',
        'data': data
      }).done(function (rsp) {
        // self.$broadcast('list-data', rsp);
        self.$data.listResponse = rsp;
        var $pagin = $('#pagination');
        if (rsp.status) {
          pagin($pagin, pageno, rsp.result.total_pages, pagesize, rsp.result.total_items, getList.bind(self));
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
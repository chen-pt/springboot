require(['common', 'core/pagin', 'vue', 'sui'], function(YBZF, pagin, Vue) {
    Vue.config.delimiters = ["<%=", "%>"];
    // 列表
    var listConfig = (function() {
        var filters = {
            'distribution_distance': function(value) {
               value =  value ? value :0;
               value = (value/1000).toFixed(3);
               return value ? value : 'unknow';
            },
            'money': function(value) {
                value =  value ? value :0;
                value = (value/100).toFixed(2);
                return value ? value : 'unknow';
            },
            'status': function(value) {
                var dict = {'0': '已通知', '1': '系统已接单', '2': '已分配到骑手', '3': '骑手已到店','4':'配送中','5':'已送达','6':'已取消','7':'异常','8':'退单'};

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
            'order_number'      : '',
            'waybill_number'    : '',
            'logistics_name'    : '',
            'district'           : '',
            'create_time_start' : '',
            'create_time_end'   : '',
            'pageno'             : 1,
            'pagesize'           : 15
        };

        var config = {
            'replace': false,
            'data': function() {
                return defaultData;
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
                'url': YBZF.hostname + '/services/getLogisticsList',
                'data': data
            }).done(function (rsp) {
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
            'el': '#logistics-list',
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
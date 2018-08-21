define(['core', 'service/pagin'],function(core, pagin) {
    'use strict';

    var Activity = {};
    // 配置
    var config = {};

    // TODO 改名
    Activity.tools = function(type) {

        switch (type) {
            case 110:
                return new Discount();
            case 120:
                return new FreePost();
            case 130:
                return new FullReduce();
            case 140:
                return new FirstOrder();
            case 160:
                return new LimitedPrice();
            default:
                return new Discount();
        }
    };

    // 添加活动
    Activity.add = function() {

    };

    // 初始化
    Activity.init = function(config) {

    };

    // 获取列表
    Activity.getList = function(pageno) {
        var data = $('#search-form').serializeArray();
        var pagesize =  $('.page-size-sel').val() || 15;
        data.push({'name': 'pageno', 'value': pageno});
        data.push({'name': 'pagesize', 'value': pagesize});

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1,'#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            'url': core.getHost() + '/promotion/getList',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {

            // 最少需要加载1.5S
            if(new Date() - idxTime < 1500) {
                setTimeout(function() {
                    layer.close(idx);
                }, 1500 - (new Date() - idxTime));
            } else {
                layer.close(idx);
            }

            var html = $('#promotion-list-temp').html();
            html = doT.template(html)(rsp);
            $('#promotion-list').empty().append(html);
            //pagin('#pagin', pageno, rsp.result.total_pages, null, null,Activity.getList);
            pagin('#pagin', +rsp.result.current, rsp.result.total_pages || 1, pagesize, rsp.result.total_items, function(pageno) {
                Activity.getList(pageno)
            });
        });
    };

    // 获取商品列表
    Activity.getGoodsList = function(pageno) {
      pageno = pageno || $('#all-goods-pagin').find('.active a').attr('data') || 1;//选择的当前第几页

      var data = $('#goods-search-form').serializeArray();
      data.push({'name': 'pageno', 'value': pageno});
      var page_size =$('.page-size-sel').val()||15;
      data.push({'name': 'pagesize', 'value': page_size});



      $.ajax({
        'url': core.getHost() + '/goods/getList',
        'type': 'post',
        'data': data,
        'dataType': 'json'
      }).done(function(rsp) {
        var html = $("#goods-list-temp").html();
        rsp.type = $('#' + $('#formId').val()).find('[name=promotion_type]').val();
        if (rsp.type == 160) {
            rsp.limit_price = $('#limit_price').val();
        } else {
            rsp.discount = $('#dis').val();
        }
        rsp.selIds = $('#sel-ids').val().split(',');
        html = doT.template(html)(rsp);
        $('#all-goods-list').empty().append(html);
        //pagin('#all-goods-pagin', pageno, rsp.result.total_pages || 1, null, null, Activity.getGoodsList);
        pagin('#all-goods-pagin', +rsp.result.current, rsp.result.total_pages || 1, page_size, rsp.result.total_items, function(pageno) {
            Activity.getGoodsList(pageno)
        });
        $('#check-all-goods').prop('checked', false);
      });
    };

    // 获取选择商品列表
    Activity.getSelGoodsList = function(pageno) {
      pageno = pageno || $('#sel-goods-pagin').find('.active a').attr('data') || 1;
      var ids = $('#sel-ids').val().split(',');
      var pagesize = 10;
      var start = (pageno - 1) * pagesize;
      var rangeIds = ids.slice(start, start + pagesize).join();

      // 这一页没有数据 取上一页... 如果上一页还没有就这样吧

      if (! rangeIds && pageno != 1) {
        pageno --;
        start = (pageno - 1) * pagesize;
        rangeIds = ids.slice(start, start + pagesize).join();
      }

        return $.ajax({
            'url': core.getHost() + '/goods/batchList',
            'type': 'post',
            'data': {
                'goods_ids': rangeIds
            },
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp.status) {
                rsp.result = {'items': rsp.result};
                rsp.result.current = pageno;
                rsp.result.total_pages = Math.ceil(ids.length / pagesize) || 1;
            }
            rsp.type = $('#' + $('#formId').val()).find('[name=promotion_type]').val();

            if (rsp.type == 160) {
                rsp.limit_price = $('#limit_price').val();
            } else {
                rsp.discount = $('#dis').val();
            }

            rsp.selIds = $('#sel-ids').val().split(',');
            var html = $("#goods-list-temp").html();
            html = doT.template(html)(rsp);
            $('#sel-goods-list').empty().append(html);
            // 翻页
            //pagin('#sel-goods-pagin', pageno, Math.ceil(ids.length / pagesize) || 1, null, null, Activity.getSelGoodsList);
            pagin('#sel-goods-pagin', +rsp.result.current, rsp.result.total_pages || 1, pagesize, rsp.result.total_items, function(pageno) {
                Activity.getSelGoodsList(pageno)
            });
            $('#check-sel-goods').prop('checked', false);
        });
    };

    Activity.send = function(data) {
        $.ajax({
            'url': core.getHost() + '/promotion/send',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp.status) {
                layer.alert('活动创建成功,点此<a href="/promotion/index">返回列表</a>');
            } else {
                if (rsp.result.notes) {
                    layer.alert('活动有效期内已有同类型的活动。');
                } else {
                    layer.alert(rsp.result.msg);
                }
            }
        });
    };

    Activity.endPromotion = function(id) {
        $.ajax({
            'url': core.getHost() + '/promotion/endPromotion',
            'type': 'post',
            'data': {
                'promotion_id': id
            },
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp.status) {
                layer.msg('结束成功');
                Activity.getList(1);
            } else {
                layer.msg(rsp.result.msg);
            }
        });
    };

    // 满减活动
    function FullReduce() {
        // TODO init
    }

    FullReduce.prototype = Activity;

    // 包邮活动
    function FreePost() {
        // TODO init
    }

    FreePost.prototype = Activity;

    FreePost.prototype.getCitys = function() {
        return $.ajax({
            'url': core.getHost() + "/lib/getcitys_ext",
            'type': 'post',
            'dataType': 'json'
        }).done(function(rsp) {
            var $list = $("#free_ragion_list").empty();

            for(var k in rsp.result) {
                var groupName = rsp.result[k].code;
                var tpl =
                    '<div class="control-group" style="width: 100%;margin-bottom: 8px;">' +
                    '<label style="font-weight: bold;width: 50px;display: table-cell;vertical-align: top;" class="city-group">' +
                    '<input type="checkbox" value="0" name="' + groupName +'">' + rsp.result[k].name  +
                    '</label>' +
                    '<div class="controls">';

                for(var t in rsp.result[k].provinces) {
                    var ti = rsp.result[k].provinces[t];
                    tpl += '<label style="width: 20%;float: left;display: block;margin-bottom: 8px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;"><input type="checkbox" name="' + groupName + '" value="' + ti.areaid + '">' + ti.name + '</label>';
                }

                tpl += '</div>' +'</div>';
                $list.append(tpl);
            }
        });
    };

    // 打折活动
    function Discount() {
        // TODO init
    }
    Discount.prototype = Activity;

    // 首单活动
    function FirstOrder() {
        // TODO init
    }
    FirstOrder.prototype = Activity;

    // 首单活动
    function LimitedPrice() {
        // TODO init
    }

    LimitedPrice.prototype = Activity;

    return Activity;
});
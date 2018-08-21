/**
 * Created by boren on 15/7/6.
 * 订单处理服务
 */
define(['core', 'service/pagin'],function(core,pagin) {
    var mod = {};
    var page_size = 15;


    /**
     * 设置页码
     * @param val
     */
    var setPageSize = function (val) {
        page_size = val;
    };

    /**
     * 订单显示
     * @param opt  是否是搜索
     * @param status 所有订单，送货上门，自提，药房直购 ,货到付款
     * @param num
     */
    var showAllOrder = function (opt, status, num, pay, trades) {
        var postdata = {};
        var pagesize = $('.page-size-sel').val() || 15;
        if (opt == 'search') {
            postdata.id = $('#tid').val();
            postdata.phone = $('#phone').val();
            postdata.start_time = $('#date_start').val();
            postdata.end = $('#date_end').val();
            postdata.start_time = $('#start_time').val();
            postdata.end_time = $('#end_time').val();
            postdata.trades_rank = $('#trades_rank').val();
            postdata.pay_style = $("#pay_style").val();
            postdata.logistics_status = $('#logistics_status').val();
        }
        postdata.status = status;
        postdata.pageSize = pagesize;
        postdata.pageno = num;
        postdata.trades_status = trades || $('#trades_status').val();
        postdata.clerk_invitation_code = $('#clerk_invitation_code').val();
        postdata.post_style = pay || $('#post_style').val();

        // 根据订单状态选中标签页
        $('#order_tabs').find('[data-value="' + postdata.trades_status + '"]').addClass('active').siblings().removeClass('active');
        // 加载层
        var idx = layer.load(1, {
            shade: [0.1, '#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost() + '/order/getOrders',
            success: function (e) {

                // 最少需要加载1.5S
                if (new Date() - idxTime < 1500) {
                    setTimeout(function () {
                        layer.close(idx);
                    }, 1500 - (new Date() - idxTime));
                } else {
                    layer.close(idx);
                }

                //console.log('order index :'+e);
                var data = JSON.parse(e);
                if (data.status == true) {
                    //判断备货发货的弹框提示状态
                    var kaxi = 0;

                    for (var i = 0, len = data.result.items.length; i < len; i++) {
                        data.result.items[i].except_num = 0;//自定义问题商品数量
                        data.result.items[i].except_goods = "";//自定义问题商品名称暂存

                        for (var x = 0, xlen = data.result.items[i].order_list.length; x < xlen; x++) {
                            if (data.result.items[i].order_list[x].goods_status != 1) {
                                data.result.items[i].except_num += 1;
                                data.result.items[i].except_goods = data.result.items[i].order_list[x].goods_title;
                                //console.log(data.result.items[i].except_num);
                            }
                        }

                    }
                    // 已过时间计算

                    data.dateText = function (trade) {
                        var date = new Date();
                        // 取本地时间
                        var now = new Date();
                        var prefix = '';
                        switch (+trade.trades_status) {
                            case 110:
                                // 根据状态取对应的时间
                                date = new Date(trade.create_time.replace(/-/g, '/'));
                                prefix = '已下单';
                                break;
                            case 120:
                                if (trade.shipping_status == 120 && trade.post_style == 180) {
                                    return "";
                                    break;
                                } else if (trade.pay_style == '' && trade.post_style == 160) {
                                    date = new Date(trade.create_time.replace(/-/g, '/'));
                                    prefix = '已下单';
                                    break;
                                } else {
                                    date = new Date(trade.pay_time.replace(/-/g, '/'));
                                    prefix = '已付款';
                                    break;
                                }
                            case 190:
                                date = new Date(trade.refund_time.replace(/-/g, '/'));
                                prefix = '申请退款';
                                break;
                            case 130:
                                date = new Date(trade.consign_time.replace(/-/g, '/'));
                                prefix = '已发货';
                                break;
                            case 150:
                                return '';
                                break;
                            default:
                                return trade.create_time;
                        }
                        var diff = Math.abs(now - date);
                        // 计算天
                        var d = Math.floor(diff / 86400000);
                        // 计算小时
                        var h = Math.floor(diff / 3600000) % 24;
                        // 计算分钟
                        var m = Math.floor((diff / 60000) % 60);
                        return prefix + (d ? d + '天' : '') + (h ? h + '小时' : '') + (m + '分');
                    };

                    var tpl = $("#list_templete").html();
                    var doTtmpl = doT.template(tpl);
                    var html = doTtmpl(data);
                    $("#order_list").html(html);
                    //翻页条码
                    pagin('#pagelsit', +data.result.current, data.result.total_pages, pagesize, data.result.total_items, function (num) {
                        showAllOrder(opt, status, num, pay, trades);
                    });

                    if (status == 'todoor' || status == 'since' || status == 'all') {
                        todoorShowStocking(data.result.stocks);
                    }
                    $('#pagelsit').show();
                } else {
                    $("#order_list").html('<div class="introjs-content">' + data.result.msg + '</div>');
                    $('#pagelsit').hide();
                }

                $('[data-toggle="tooltip"]').tooltip();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var error = {'action': '所有订单', 'type': 'http', 'desc': ''};
                core.exeError(error, XMLHttpRequest, textStatus, errorThrown);
            }
        });
        //侍处理订单提示
        popOrders();
    };

    /**
     * 侍处理订单提示
     * @param pop
     */
    var popOrders = function () {
        $.ajax({
            type: 'POST',
            data: {},
            url: core.getHost() + '/order/popOrder',
            success: function (e) {

                console.log('order pop :' + e);
                var data = JSON.parse(e);
                if (data.status) {
                    if (data.result.door_delivery > 0) {
                        $('#delivery').css('display', 'block').html(data.result.door_delivery);
                    } else {
                        $('#delivery').css('display', 'none');
                    }
                    if (data.result.stores_logistics > 0) {
                        $('#selftaken').css('display', 'block').html(data.result.stores_logistics);
                    } else {
                        $('#selftaken').css('display', 'none');
                    }
                    if (data.result.direct_purchase > 0) {
                        $('#directbuy').css('display', 'block').html(data.result.direct_purchase);
                    } else {
                        $('#directbuy').css('display', 'none');
                    }
                    if (data.result.goods_prebook > 0) {
                        $('#prebook').css('display', 'block').html(data.result.goods_prebook);
                    } else {
                        $('#prebook').css('display', 'none');
                    }

                } else {
                    $.alert({'title': '温馨提示!', 'body': data.result.msg});
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                var error = {'action': '订单提示', 'type': 'http', 'desc': ''};
                core.exeError(error, XMLHttpRequest, textStatus, errorThrown);
            }
        });
    };

    /**
     * 送货上门列表显示送货单号
     *  @param stocks
     */
    var todoorShowStocking = function (stocks) {
        for (var i = 0, len = stocks.length; i < len; i++) {
            $('#todoor_' + stocks[i].trades_id).html(stocks[i].stockup_id);
        }
    };

    /**
     * 订单详情
     *  @param has_comment
     */
    var showDetail = function (has_comment) {
        var postdata = {};
        postdata.id = $('#tradeid').val();
        postdata.has_comment = has_comment || 0;

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost() + '/order/getOrder',
            success: function (e) {
                var data = JSON.parse(e);
                if (data.status == true) {
                    var tpl = $("#detail_template").html();
                    var doTtmpl = doT.template(tpl);
                    var html = doTtmpl(data);
                    $("#detail").html(html);

                    var seller_flag = data.result.trades_information.seller_flag;
                    $('.flag-box').find('input[value="' + seller_flag + '"]').attr('checked', true);
                    show_text_num();
                } else {
                    $.alert({'title': '温馨提示!', 'body': data.result.msg});
                }
            }
        });
    };

    /**
     * 批量确认收货
     * @param has_logistics
     */
    var batchConfirm = function (has_logistics) {
        var trades = [];

        $(":checkbox").each(function () {
            if ($(this).is(':checked') && $(this).val() != '0') {
                var trade_id = $(this).val();
                var trade_status = $('#tradestatus_' + trade_id).val();

                if (trade_status == 130 || trade_status == 120) { //检查是否是未备货状态
                    trades.push(trade_id);
                } else {
                    $(this).prop("checked", false);
                }
            }
        });

        console.log('选择的订单：'+JSON.stringify(trades));
        if(trades.length>0) {
            var postdata = {trades:JSON.stringify(trades),logistics:has_logistics};
            $.ajax({
                type: 'POST',
                data: postdata,
                url: core.getHost() + '/order/batchReceipt',
                success: function (e) {
                    console.log('order batchReceipt :' + e);
                    var data = JSON.parse(e);

                    if (data.status) {
                        $.alert({
                            'title': '温馨提示!', 'body': '操作成功！', 'okHide': function () {
                                window.location.reload();
                            }
                        });
                    } else {
                        var body = "<table  border='1' cellpadding='1' cellspacing='0'><tr><td>订单号</td><td>失败原因</td></tr>";
                        for (var i = 0, len = data.result.length; i < len; i++) {
                            var tr = "<tr><td>" + data.result[i].trade_id + "</td><td>" + data.result[i].msg + "</td></tr>";
                            body += tr;
                        }
                        body += "</table>";
                        console.log('body:' + body);
                        $.alert({'title': '失败提示!', 'body': body});
                    }
                }
            });
        } else {
            $.alert({'title': '温馨提示!', 'body': '未选择任何订单或所选订单还未完成送货！'});
        }
    };

    /**
     * 全选/全不选
     * @param eml
     */
    var checkAll = function (eml) {
        var ischecked = $('#' + eml).is(':checked');

        if (ischecked) {
            $(":checkbox").each(function () {
                var disabled = $(this).attr('disabled');
                if (disabled != 'disabled') {
                    $(this).prop("checked", true);
                }
            });
        } else {
            $(":checkbox").each(function () {
                $(this).prop("checked", false);
            });
        }
    };

    /**
     * 批量备货
     * @param action trades_id
     */
    var batchStocking = function (action, trades_id, kaxi) {
        var trades = trades_id || '';
        $(":checkbox").each(function () {
            if ($(this).is(':checked') && $(this).val() != '0') {
                var trade_id = $(this).val();
                if (valdateOrderStatus(trade_id, 110)) { //检查是否是未备货状态
                    trades += trade_id + ',';
                } else {
                    $(this).prop("checked", false);
                }
            }
        });
        console.log('批量备货：' + trades);

        if (trades.length > 0) {

            window.location.href = core.getHost() + '/order/stocking#' + action + '&' + trades;


        } else {
            $.alert({'title': '温馨提示!', 'body': '未选择任何订单或所选订单已完成备货！'});
        }
    };
    /**
     * 检查订单状态
     * @param trades_id
     */
    var valdateOrderStatus = function (trade_id, valdate_val) {
        var valdate = $('#status_' + trade_id).val();
        var trade_status = $('#tradestatus_' + trade_id).val();

        if (parseInt(trade_status) <= 120 && ((parseInt(valdate_val) == parseInt(valdate)) || (valdate_val == 110 && valdate == 'null'))) {
            return true;
        } else {
            return false;
        }
    };

    /**
     * 显示备货单
     * @param trades
     */
    var showStocking = function () {
        var ordersstr = (!window.location.hash) ? "#no" : window.location.hash;
        ordersstr = ordersstr.substr(1, ordersstr.length);
        window.location.hash = ordersstr;
        orders = ordersstr.split('&');
        var trades = orders[1];

        if (trades.length > 0) {
            var postdata = {tradeids: trades};
            $.ajax({
                type: 'POST',
                data: postdata,
                async: false,
                url: core.getHost() + '/order/getStockup',
                success: function (e) {
                    var data = JSON.parse(e);

                    if (data.status) {
                        data.module = orders[0];
                        var tpl = $("#list_template").html();
                        var doTtmpl = doT.template(tpl);
                        var html = doTtmpl(data);
                        $("#stock_list").html(html);

                        if(data.result.length  == 1){
                            // var appends = '<div class="order-detail-div"><div class="title" style="float: left"><h4>本单支持服务的快递公司</h4><div class="exp"><img src="{{ constant('SOURCE_URL') }}/store/static/images/erp.png"/></div></div><div style="float: right;height:100%;vertical-align: middle"><button class="sui-btn btn-xlarge btn-warning" style="margin-top: 15px;" id="express_btn">通知取货</button></div><div style="clear: both"></div></div>';

                            if(data.result[0].display){
                                $("#express_tpl").css('display','block');

                                var statuss = new Array(0,1,2,3,4,5,6,7,8);

                                var ele = parseInt(data.result[0].logistics_status);

                                if($.inArray(ele,statuss) == (-1)){

                                    var btn = '<button class="sui-btn btn-xlarge btn-warning" style="margin-top: 15px;" id="express_btn">通知取货</button>';

                                }else{

                                    var btn = '<button class="sui-btn btn-xlarge btn-warning" style="margin-top: 15px;" disabled="disabled" id="express_btn">通知取货</button>';
                                }

                                $("#button").append(btn)
                            }


                        }

                        if (data.module == 'since' || data.module == 'indexsince') {
                            core.formatDate();
                            var new_date = new Date();
                            var startdate = new_date.format('yyyy-MM-dd hh:mm');
                            var enddate = new Date(new_date.getTime() + (7 * 24 * 60 * 60 * 1000)).format('yyyy-MM-dd hh:mm');
                            console.log('now:' + new_date + '  start:' + startdate + ' end:' + enddate);
                            $('#date_start').val(startdate);//datepicker('update', startdate);
                            $('#date_end').val(enddate);//datepicker('update', enddate);
                        }

                        if(data.result[0])
                        // 选择快递的对话框
                        $('#selectShipping-Modal').on('show', (function () {
                            // 保存ajax请求数据  FIXME 如果请求失败也会保存下来
                            var shippingDfd = $.ajax({
                                'url': core.getHost() + '/lib/selectShipping',
                                'dataType': 'json'
                            });
                            var $selectLogid = $('#log_id');

                            return function () {
                                shippingDfd.done(function (rsp) {
                                    $selectLogid.empty().append('<option value="">请选择</option>');
                                    if (rsp.status) {
                                        $(rsp.result).each(function (k, v) {
                                            var html = '<option value="$log_id">$name</option>'.replace('$name', v.name).replace('$log_id', v.log_id);
                                            $selectLogid.append(html);
                                        });
                                    }
                                });
                            }
                        }()));
                        // 货到付款送货页面提示show
                        if (data.module == "todoor" || orders[0] == "indextodoor" || data.module == 'buying' || data.module == 'indexbuying') {
                            $('#selectShipping-warp').show();
                        }
                        // 提交选择快递
                        $(document).on('click', '#set-shipping', function () {
                            var data = $('#select-shipping-form').serializeArray();
                            if (!$('#log_id').val()) {
                                layer.msg('请选择物流公司');
                                return;
                            }
                            var log_num = $('#log_num').val();
                            if (!log_num) {
                                layer.msg('请输入运单号码');
                                return;
                            }
                            if (!$.isNumeric(log_num)) {
                                layer.msg('运单号码必须全部是数字');
                                return;
                            }

                            $.ajax({
                                'url': core.getHost() + '/order/setShipping',
                                'type': 'post',
                                'data': data,
                                'dataType': 'json'
                            }).done(function (rsp) {
                                if (rsp && rsp.status) {
                                    $('#selectShipping-Modal').modal('hide');
                                    layer.alert(rsp.result.msg, {
                                        time: 3000,
                                        end: function () {
                                            window.location.href = core.getHost() + '/order/' + (orders[0] || 'todoor' );
                                        }
                                    });
                                } else {
                                    layer.alert(rsp.result.msg);
                                }
                            });
                        });
                    } else {
                        $.alert({'title': '温馨提示!', 'body': data.result.msg});
                    }
                }
            });
        }
    };

    /**
     * 完成备货
     * @param trades_id
     */
    var flushStocking = function () {
        var ordersstr = (!window.location.hash) ? "#no" : window.location.hash;
        ordersstr = ordersstr.substr(1, ordersstr.length);
        window.location.hash = ordersstr;
        orders = ordersstr.split('&');
        var trades = orders[1];

        if (trades.length > 0) {
            var postdata = {tradeids: trades};
            var valdate = {flag: true, msg: ''};
            postdata.status = orders[0];

            if (orders[0] == 'since' || orders[0] == 'indexsince') {
                //用户自提
                postdata.start = $('#date_start').val();
                postdata.end = $('#date_end').val();

                if (postdata.start == '') {
                    valdate.flag = false;
                    valdate.msg = '开始提货时间不能为空！';
                } else if (postdata.end == '') {
                    valdate.flag = false;
                    valdate.msg = '截止提货时间不能为空！';
                }
            }
            //var postdata = {tradeids:'10021435132298429,10021435132494471'};
            if (valdate.flag) {

                $.ajax({
                    type: 'POST',
                    data: postdata,
                    async: false,
                    url: core.getHost() + '/order/batchStock',
                    success: function (e) {
                        var data = JSON.parse(e);
                        if (data.status) {
                            var action = orders[0];
                            if (action == 'index' || action == 'since') {
                                action = 'index';
                            }
                            if (!action) {
                                window.location.href = core.getHost() + '/order/index';
                            } else {

                                window.location.href = core.getHost() + '/order/' + action;
                            }
                        } else {
                            $.alert({'title': '温馨提示!', 'body': data.result.msg});
                        }
                    }
                });
            } else {
                $.alert({'title': '温馨提示!', 'body': valdate.msg});
            }
        }
    };
    /**
     * 显示店员
     * @param clerk
     */
    var showClerk = function () {
        $.ajax({
            type: 'POST',
            data: {},
            url: core.getHost() + '/order/getStoreClerk',
            success: function (e) {
                var data = JSON.parse(e);
                if (data.status) {
                    var tpl = $("#clerk_template").html();
                    var doTtmpl = doT.template(tpl);
                    var html = doTtmpl(data);
                    $("#clerk_select").html(html);
                } else {
                    if (data.result.code == '8561') {
                        $.confirm({
                            'title': '温馨提示!',
                            'body': '本店还没有店员，请添加店员哦！',
                            'okBtn': '立即添加',
                            'cancelBtn': '稍后再说',
                            okHide: function () {
                                window.location.href = core.getHost() + '/clerk/add';
                            }
                        });
                    } else {
                        $.alert({'title': '温馨提示!', 'body': data.result.msg});
                    }
                    $("#clerk_select").html('本店还没有店员，请<a href="' + core.getHost() + '/clerk/add">添加店员</a>');
                }
            }
        });
    };

    /**
     * 批量送货
     * @param action tradesid
     */
    var batchToDoor = function (action, tradesid, kaxi) {
        var trades = tradesid || '';

        $(":checkbox").each(function () {
            if ($(this).is(':checked') && $(this).val() != '0') {
                var trade_id = $(this).val();
                //检查是否是未备货状态
                if (valdateOrderStatus(trade_id, 120)) {
                    trades += trade_id + ',';
                } else {
                    $(this).prop("checked", false);
                }
            }
        });
        console.log('批量备货：' + trades);
        if (trades.length > 0) {
            window.location.href = core.getHost() + '/order/delivery#' + action + '&' + trades;
        } else {
            $.alert({'title': '温馨提示!', 'body': '未选择任何订单或所选订单状态不正确，不能进行送货操作！'});
        }
    };


    /**
     * 送货
     * @param trades
     */
    var goToDoor = function () {
        var ordersstr = (!window.location.hash) ? "#no" : window.location.hash;
        ordersstr = ordersstr.substr(1, ordersstr.length);
        window.location.hash = ordersstr;
        orders = ordersstr.split('&');
        var trades = orders[1];

        if (trades.length > 0) {
            var postdata = {tradeids: trades};
            //var postdata = {tradeids:'10021435132298429,10021435132494471'};
            postdata.clerkid = $('#sotore_worker').val();

            if (("undefined" != typeof(postdata.clerkid)) && postdata.clerkid != -1) {
                $.ajax({
                    type: 'POST',
                    data: postdata,
                    async: false,
                    url: core.getHost() + '/order/batchTodoor',
                    success: function (e) {
                        var data = JSON.parse(e);
                        if (data.status) {
                            window.location.href = core.getHost() + '/order/' + orders[0];
                        } else {
                            $.alert({'title': '温馨提示!', 'body': data.result.msg});
                        }
                    }
                });
            } else {
                $.alert({'title': '温馨提示!', 'body': '请选择送货员！'});
            }
        }
    };

    /**
     * 发送提货码
     * @param tradesid
     */
    var sendSinceCode = function (tradesid) {
        var postdata = {};
        postdata.tradesid = tradesid;

        $.ajax({
            type: 'POST',
            data: postdata,
            async: false,
            url: core.getHost() + '/order/sendSinceCode',
            success: function (e) {
                var data = JSON.parse(e);
                if (data.status) {
                    $.alert({'title': '温馨提示!', 'body': '发送成功！'});
                } else {
                    $.alert({'title': '温馨提示!', 'body': data.result.msg});
                }
            }
        });
    };

    /**
     * 确认收货
     * @param tradesid
     */
    var confirmReceipt = function (tradesid) {
        var postdata = {};

        postdata.tradesid = tradesid;

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost() + '/order/confirmReceipt',
            success: function (e) {
                var data = JSON.parse(e);
                if (data.status) {
                    $.alert({'title': '温馨提示!', 'body': '交易已成功！'});
                    window.location.href = core.getHost() + '/order/buying';
                } else {
                    $.alert({'title': '温馨提示!', 'body': data.result.msg});
                }
            }
        });
    };
    /**
     * 提货码验证
     * @param code
     * @param has_pick string|int 是否提货
     */
    var userTakedelivery = function (code, has_pick) {
        var postdata = {};
        postdata.code = code;
        postdata.has_pick = has_pick;

        $.ajax({
            type: 'POST',
            data: postdata,
            async: false,
            url: core.getHost() + '/order/checkSinceCode',
            success: function (e) {

                var data = JSON.parse(e);
                if (data.status) {

                    //console.log(data.result);
                    //判断备货发货的弹框提示状态+
                    data.result.except_goods = 0;
                    $.each(data.result.order_list, function (index, value) {
                        if (value.goods_status != 1) {
                            data.result.except_goods += 1;
                            data.result.except_name = value.goods_title;

                        }
                    });


                    var tpl = $("#delivery_template").html();
                    var doTtmpl = doT.template(tpl);
                    data.has_pick = has_pick;
                    var html = doTtmpl(data);
                    $("#item_list").html(html);
                    if (!has_pick && data.result.trades_information.trades_status == 120) {
                        // 显示提货码按钮 并绑定事件
                        if (data.result.except_goods > 1 || (data.result.except_goods == 1 && data.result.order_list.length > 1 )) {
                            $(".single_goods").addClass('hide');
                            $(".much_goods").removeClass('hide');
                            $(".goods_name").html(data.result.except_name);
                            $(".number_beihuo").html(data.result.except_goods);

                            $('#pick-goods-btn').show().on('click', function () {//提货按钮
                                $("#message_goods").modal("show");
                                $(".beihuo1").html("不能提货");
                                $(".beihuo2").html("不能提货");
                                $(".beihuo").html("知道了，继续提货");

                                $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + data.result.trades_information.trades_id);
                                $(document).on('click', '.beihuo', function () {
                                    userTakedelivery(code, 1);
                                })


                            });
                        } else if (data.result.except_goods > 0) {

                            $('#pick-goods-btn').show().on('click', function () {//提货按钮
                                $("#message_goods").modal("show");
                                $(".beihuo1").html("不能提货");
                                $(".beihuo2").html("不能提货");
                                $(".beihuo").html("知道了，继续提货");
                                $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + data.result.trades_information.trades_id);
                                $(document).on('click', '.beihuo', function () {
                                    userTakedelivery(code, 1);
                                })


                            });
                        } else {
                            $('#pick-goods-btn').show().on('click', function () {
                                userTakedelivery(code, 1);
                            });
                        }

                    } else {
                        $('#pick-goods-btn').hide();
                    }
                } else {
                    $.alert({'title': '温馨提示!', 'body': '提货码有误!'});
                }
            }
        });
    };

    /**
     * 显示订单统计
     * @param pageno
     */
    var showCountOrder = function (pageno) {
        var data = $('#order-search-form').serializeArray();
        var pagesize = $('.page-size-sel').val() || 15;
        data.push({'name': 'pageno', 'value': pageno});
        data.push({'name': 'pagesize', 'value': pagesize});

        // 加载层
        var idx = layer.load(1, {
            shade: [0.1, '#fff']
        });
        //加载层时间
        var idxTime = new Date();

        $.ajax({
            'url': core.getHost() + '/order/getCountOrderList',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).success(function (rsp) {

            // 最少需要加载1.5S
            if (new Date() - idxTime < 1500) {
                setTimeout(function () {
                    layer.close(idx);
                }, 1500 - (new Date() - idxTime));
            } else {
                layer.close(idx);
            }

            rsp.conv_post_style = function (post_style) {
                var temp = {
                    '110': '包邮',
                    '120': '平邮',
                    '130': '快递',
                    '140': 'EMS',
                    '150': '送货上门',
                    '160': '上门自提',
                    '170': '门店直销',
                    'default': '其它'
                };
                return temp[post_style || 'default'];
            };

            rsp.conv_pay_style = function (pay_style) {
                var temp = {
                    'ali': '支付宝',
                    'wx': '微信',
                    'bil': '快钱',
                    'default': '无'
                };
                return temp[pay_style || 'default'];
            };

            rsp.conv_trades_source = function (trades_source) {
                var temp = {
                    '110': ' 网站',
                    '120': '微信',
                    '130': 'app',
                    '140': '直购',
                    '9999': '其它',
                    'default': '无'
                };
                return temp[trades_source || 'default'];
            };

            var html = $('#trade-list-temp').html();
            html = doT.template(html)(rsp);
            $('#trade-list').empty().append(html);

            pagin('#pagein', +rsp.result.current, rsp.result.total_pages, pagesize, rsp.result.total_items, function (pageno, pagesize) {
                showCountOrder(pageno, pagesize);
            });
            if (rsp.status) {
                $('#pagein').show();
            } else {
                $('#pagein').hide();
            }
        }).fail(function () {
            // TODO ajax请求失败
        });
    };
    /**
     * 保存批次号
     */
    var save_goods_batch_no = function () {

        var order_batch_no = $('#updateGoodsBatchNo [name="order_batch_no"]').val();
        var goods_id = $('#updateGoodsBatchNo [name="goods_id"]').val();
        var order_id = $('#updateGoodsBatchNo [name="order_id"]').val();
        var datas = {};
        datas.goods_batch_no = order_batch_no;
        datas.goods_id = goods_id;
        datas.order_id = order_id;

        var url = core.getHost() + "/order/updateOrdersGoods";
        $.post(url, datas, function (e) {

            var data = JSON.parse(e);

            if (data.status) {
                alert("保存成功！");
                $("#updateGoodsBatchNo").modal("hide");
            } else {
                alert("保存成功！");
                $("#updateGoodsBatchNo").modal("hide");
            }
                window.location.reload();
        });

    //return function

};
    /**
     * 添加备注
     * @param trades_id
     */
    var showseller = function () {
        var postdata = {};

        postdata.trades_id = $('#tradeid').val();
        postdata.seller_flag = $('[name="seller_flag"]:checked').val();
        postdata.seller_memo = $("#seller_memo").val();

        if(!postdata.seller_memo){
            layer.msg("请填写“备注”。");
            return;
        }
        if(!postdata.seller_flag) {
            layer.msg('请选择旗帜');
            return;
        }

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/order/setSeller',
            success:function(e){
                var data = JSON.parse(e);
                if(data.status) {
                    layer.msg('提交成功，谢谢！',function(){
                        var num = $('.sui-pagination li.active a').html();
                        showAllOrder('default','all',num);
                        $('#seller-modal').modal('hide');
                    });
                }else{
                    layer.msg('提交失败！');
                }
            }
        });
    };

    var showCommentDetail = function () {
        var postdata = {};

        postdata.trades_id = $('#tradeid').val();
        postdata.goods_id = $('#goods_id').val();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/order/setCommentDetail',
            success:function(e){
                var data = JSON.parse(e);
                if(data.status) {
                    $.alert({'title':'温馨提示!','body':'交易已成功！'});
                }else{
                    $.alert({'title':'温馨提示!','body':data.result.msg});
                }
            }
        });
    };

    /**
     *现金收款
     * @param trades_id
     */
    var showPayTradesByCashReceipts = function () {
        var postdata = {};

        // 订单ID
        postdata.trades_id = $("#trade-id").val();
        // 订单总额
        var cash_total = parseFloat($('#cash-need').html() || 0);
        //找零
        var odd_change = parseFloat($('#odd-change').html());
        // 现金支付
        var cash_paymentPay = parseFloat($('#cash-payment-pay').val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'));
        // 医保支付
        postdata.medical_insurance_card_pay = parseFloat($('#medical-insurance-card-pay').val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3') || 0);
        // 线下优惠
        postdata.line_breaks_pay = parseFloat($('#line-breaks-pay').val().replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3') || 0);
        // 实付现金=现金支付-找零
        postdata.cash_payment_pay = (cash_paymentPay - odd_change).toFixed(2);
        // 备注
        postdata.cash_receipt_note = $('#cash-receipt-note').val();

        if(postdata.line_breaks_pay >= cash_total) {
            layer.msg('优惠金额必须小于实付款!');
            return;
        }
        if (postdata.medical_insurance_card_pay > cash_total - postdata.line_breaks_pay) {
            layer.msg('医保卡金额必须小于(实付款-优惠)!');
            return;
        }
        if(odd_change < 0) {
            layer.msg('找零不能小于0!');
            return;
        }
        //判断当前页面
        var linkSize = $('#linkSize').val();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost()+ '/order/setPayTradesByCashReceipts',
            success:function(e){
                var data = JSON.parse(e);
                if(data.status && $("#print_xiaopiao").prop("checked")==true) {
                        layer.confirm('提交成功，即将打开打印小票页面',{btn:['OK']},function(){
                            window.open('/print/receipt?tid='+ $("#trade-id").val()+"&cash="+$("#cash-payment-pay").val()+"&back="+$("#odd-change").html());

                            window.location.reload();
                        })


                }else if(data.status) {
                    layer.msg('支付成功!', {'time': 500, 'end': function() {
                        if(linkSize == 'index') {
                            var num = $('.sui-pagination li.active a').html();
                            showAllOrder('default', 'all', num);
                            $('#cash-receipt').modal('hide');
                        }else {
                            var num = $('.sui-pagination li.active a').html();
                            showAllOrder('default', 'buying', num);
                            $('#cash-receipt').modal('hide');
                        }
                    }});

                }else{
                    layer.msg('请填写支付金额!');
                }
            }
        });
    };
    /**
     * 导出报表
     * @param start_time&end_time
     */
    var showreportDown = function() {
        var postdata = {};
        postdata.id = $('#idDown').val();
        postdata.phone = $('#phoneDown').val();
        postdata.trades_status = $('#trades_statusDown').val();
        postdata.post_style = $('#post_styleDown').val();
        postdata.clerk_invitation_code = $('#clerk_invitation_codeDown').val();
        postdata.start_time = $('#start_timeDown').val();
        postdata.end_time = $('#end_timeDown').val();
        postdata.trades_rank = $('#trades_rankDown').val();
        postdata.pay_style = $('#pay_styleDown').val();
        postdata.total_items = $('#total_items').val();
        //导出报表正在处理，请稍后
        $('#reportDown-text').html("正在处理，请稍后.....");

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost() + '/order/getOrdersByTime',
            success: function (e) {
                var data = JSON.parse(e);
                if(data.status) {
                    if (postdata.total_items > 1000) {
                        $('#reportDown-text').html('<div>查询结果<span class="sui-text-danger">'+postdata.total_items+'</span>条，超过导出最大值！</div><div>请修改查询时间后再试哦~</div><div class="sui-text-danger">*每次最多可以导出100条，超过时请分批次下载</div>');
                    }else {
                        $('#reportDown-text').html('共查询到 <span class="sui-text-danger">'+postdata.total_items+'</span> 条记录，<a href="'+core.getHost()+'/order/export?'+  $.param(postdata) + '">点击下载报表</a>');
                    }
                }else{
                    $('#reportDown-text').html('共查询到 <span class="sui-text-danger">0</span> 条记录，<a href="javascript:void(0);">点击下载报表</a>');
                }
            }
        });
    };



    /**
     * 授权码确认提货
     * @param confirmReceipt
     */
    var showconfirmReceipt = function() {
        var postdata = {};
        postdata.authcode = $('#auth_code').val();
        postdata.tradesid = $('#trades_id').val();
        postdata.since = $('#since').val();

        $.ajax({
            type: 'POST',
            data: postdata,
            url: core.getHost() + '/order/confirmReceipt',
            success: function (e) {
                var data = JSON.parse(e);
                if(data.status) {
                    layer.msg('提货成功，谢谢！',function(){
                        var num = $('.sui-pagination li.active a').html();
                        showAllOrder('default','since',num);
                        $('#authcode-modal').modal('hide');
                    });
                }else{
                    layer.msg(data.result.msg);
                }
            }
        });
    };
    
    var birdExpress = function () {
            var ordersstr=(!window.location.hash)?"#no":window.location.hash;
            ordersstr = ordersstr.substr(1,ordersstr.length);
            window.location.hash=ordersstr;
            orders = ordersstr.split('&');
            var trades = orders[1];

            if(trades.length>0) {
                var postdata = {tradeids:trades};
                
                $.ajax({
                    type:'post',
                    url: core.getHost() + '/order/birdExpress',
                    data:{'trans_id':trades},
                    success:function (msg) {
                        var rsp = JSON.parse(msg);

                        if(rsp.status){
                            layer.alert('<h2 style="margin-top: -5px!important;">通知成功</h2>已成功通知第三方物流',{title:'配送信息',icon:1,area:'500px'},function(){
                                window.location.href = core.getHost() + '/order/todoor';
                            });

                        }else{
                            layer.msg('通知不成功('+rsp.result.msg+')');
                            // if(rsp.result.code == 50005){
                            //     layer.msg('此收货地址不存在');
                            // }else{
                            //     layer.msg('通知失败');
                            // }

                        }
                    }
                    
                })

            }
    };

    var birdExpressList = function(trade_id){

            $.ajax({
                type:'post',
                url: core.getHost() + '/order/expressList',
                data:{'trans_id':trade_id},
                success:function (msg) {

                    function getStep(status){

                        switch (parseInt(status)){
                            case 0:
                                step_name = '已通知';
                                break;
                            case 1:
                            case 2:
                            case 3:
                                step_name = '已接单';
                                break;
                            case 4:
                                step_name = '已取单';
                                break;
                            case 5:
                                step_name = '已送达';
                                break;
                            case 6:
                                step_name = '已取消';
                                break;
                            case 7:
                                step_name = '拒绝接单';
                                break;
                            case 8:
                                step_name = '已退回';
                                break;
                            default:
                                step_name = '无效的状态';
                                break;
                        }

                        return step_name;
                    }

                    var rsp = JSON.parse(msg);

                    if(rsp.result.waybill_number){
                        var express_number = rsp.result.waybill_number;
                    }else{
                        var express_number = '无';

                    }

                    if(rsp.result.diliveryman){
                        var diliveryman = rsp.result.diliveryman
                    }else{
                        var diliveryman = '无';
                    }


                    if(rsp.result.distribution_phone){
                        var distribution_phone = rsp.result.distribution_phone
                    }else{
                        var distribution_phone = '无'
                    }

                    var btn = '';

                    if(rsp.result.status == 1 || rsp.result.status == 2 || rsp.result.status == 3){
                        btn += '<button class="sui-btn cancel_btn btn-warning  style="margin-left: 200px;">取消本次送货</button><button class="sui-btn get_goods btn-warning  style="margin-left: 200px;">确认快递员取货</button><input type="hidden" name="log_num" value="'+express_number+'"><input type="hidden" name="trades_id" value="'+trade_id+'">';
                    }

                    if(rsp.result.status == 4){
                        btn += '<button class="sui-btn btn-warning send_goods" style="margin-left: 200px;">确认送达</button><input type="hidden" name="log_num" value="'+express_number+'"><input type="hidden" name="trades_id" value="'+trade_id+'">'
                    }

                    var content = '<div id="order_info">订单号：'+trade_id+'</br>运单号：'+express_number+'</br>快递公司：'+rsp.result.logistics_name+'</br>快递员：'+diliveryman+'</br>电话：'+distribution_phone+'</br>当前状态：'+getStep(rsp.result.status)+btn+'</br></div>';

                    var liArr = new Array();

                    if(rsp.status){
                        $.each(rsp.result.items,function (key,val) {

                            step_name = getStep(val.status);

                            liArr.push('<li><div class="left"><div class="line"></div><div class="step"></div></div><div class="right"><span class="step_name">'+step_name+'</span><span class="step_date">'+val.inform_time+'</span></div><div class="cl"></div></li>')
                        });
                        content += '<div id="step_list"><ul><i class="sui-icon icon-chevron-up"></i>'+liArr.join('')+'</ul></div>';

                        layer.alert(content,{title:'配送物流信息',area:'500px',btn:['关闭']})
                    }else{
                        layer.msg('没有物流信息');
                    }
                }

            })
    };
    
    var getGoods = function (data) {

        $.ajax({
            'url': core.getHost() + '/order/setShipping',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp && rsp.status) {
                $('#selectShipping-Modal').modal('hide');
                layer.alert(rsp.result.msg, {
                    time: 3000,
                    end: function() {
                        window.location.href = core.getHost()+'/order/'+ (orders[0] || 'todoor' );
                    }
                });
            } else {
                layer.alert(rsp.result.msg);
            }
        });
    };

    var cancelPush = function (order_number) {

        $.ajax({

            'url': core.getHost() + '/order/pushCancel',

            'type': 'post',

            'data': {'order_number':order_number},

            'dataType': 'json'

        }).done(function(rsp) {

            if (rsp && rsp.status) {

                layer.alert(rsp.result.msg, {

                    time: 3000,

                    end: function() {

                        location.reload()

                    }
                });

            } else {

                layer.alert(rsp.result.msg);
            }
        });
    }



    /**
     * 通知快递员取货
     */
    var birdExpress = function () {
        var ordersstr=(!window.location.hash)?"#no":window.location.hash;
        ordersstr = ordersstr.substr(1,ordersstr.length);
        window.location.hash=ordersstr;
        orders = ordersstr.split('&');
        var trades = orders[1];

        if(trades.length>0) {
            var postdata = {tradeids:trades};

            return $.ajax({
                type:'post',
                url: core.getHost() + '/order/birdExpress',
                data:{'trans_id':trades},
                success:function (msg) {
                    var rsp = JSON.parse(msg);

                    if(rsp.status){
                        layer.alert('<h2 style="margin-top: -5px!important;">通知成功</h2>已成功通知第三方物流',{title:'配送信息',icon:1,area:'500px'},function(){
                            window.location.href = core.getHost() + '/order/todoor';
                        });

                    }else{
                        layer.msg('通知不成功('+rsp.result.msg+')');
                        // if(rsp.result.code == 50005){
                        //     layer.msg('此收货地址不存在');
                        // }else{
                        //     layer.msg('通知失败');
                        // }

                    }
                }

            })

        }else{
            return $.Deferred().resolve().promise();
        }
    };

    /**
     * 查看物流信息
     * @param trade_id
     */
    var birdExpressList = function(trade_id){

        $.ajax({
            type:'post',
            url: core.getHost() + '/order/expressList',
            data:{'trans_id':trade_id},
            success:function (msg) {

                function getStep(status){

                    switch (parseInt(status)){
                        case 0:
                            step_name = '已通知';
                            break;
                        case 1:
                        case 2:
                        case 3:
                            step_name = '已接单';
                            break;
                        case 4:
                            step_name = '已取单';
                            break;
                        case 5:
                            step_name = '已送达';
                            break;
                        case 6:
                            step_name = '已取消';
                            break;
                        case 7:
                            step_name = '拒绝接单';
                            break;
                        case 8:
                            step_name = '已退回';
                            break;
                        default:
                            step_name = '无效的状态';
                            break;
                    }

                    return step_name;
                }

                var rsp = JSON.parse(msg);

                if(rsp.result.waybill_number){
                    var express_number = rsp.result.waybill_number;
                }else{
                    var express_number = '无';

                }

                if(rsp.result.diliveryman){
                    var diliveryman = rsp.result.diliveryman
                }else{
                    var diliveryman = '无';
                }


                if(rsp.result.distribution_phone){
                    var distribution_phone = rsp.result.distribution_phone
                }else{
                    var distribution_phone = '无'
                }

                var btn = '';

                if(rsp.result.status == 1 || rsp.result.status == 2 || rsp.result.status == 3){
                    btn += '<button class="sui-btn cancel_btn btn-warning" style="margin-left:90px;">取消本次送货</button><button class="sui-btn get_goods btn-warning" style="margin-left:10px;">确认快递员取货</button><input type="hidden" name="log_num" value="'+express_number+'"><input type="hidden" name="trades_id" value="'+trade_id+'">';
                }

                if(rsp.result.status == 4){
                    btn += '<button class="sui-btn btn-warning send_goods" style="margin-left: 200px;">确认送达</button><input type="hidden" name="log_num" value="'+express_number+'"><input type="hidden" name="trades_id" value="'+trade_id+'">'
                }

                var content = '<div id="order_info">订单号：'+trade_id+'</br>运单号：'+express_number+'</br>快递公司：'+rsp.result.logistics_name+'</br>快递员：'+diliveryman+'</br>电话：'+distribution_phone+'</br>当前状态：'+getStep(rsp.result.status)+btn+'</br></div>';

                var liArr = new Array();

                if(rsp.status){
                    $.each(rsp.result.items,function (key,val) {

                        step_name = getStep(val.status);

                        liArr.push('<li><div class="left"><div class="line"></div><div class="step"></div></div><div class="right"><span class="step_name">'+step_name+'</span><span class="step_date">'+val.inform_time+'</span></div><div class="cl"></div></li>')
                    });
                    content += '<div id="step_list"><ul><i class="sui-icon icon-chevron-up"></i>'+liArr.join('')+'</ul></div>';

                    layer.alert(content,{title:'配送物流信息',area:'500px',btn:['关闭']})
                }else{
                    layer.msg('没有物流信息');
                }
            }

        })
    };

    var getGoods = function (data) {

        $.ajax({
            'url': core.getHost() + '/order/setShipping',
            'type': 'post',
            'data': data,
            'dataType': 'json'
        }).done(function(rsp) {
            if (rsp && rsp.status) {
                $('#selectShipping-Modal').modal('hide');
                layer.alert(rsp.result.msg, {
                    time: 3000,
                    end: function() {
                        window.location.href = core.getHost()+'/order/'+ (orders[0] || 'todoor' );
                    }
                });
            } else {
                layer.alert(rsp.result.msg);
            }
        });
    };

    var cancelPush = function (order_number) {

        return $.ajax({

            'url': core.getHost() + '/order/pushCancel',

            'type': 'post',

            'data': {'order_number': order_number},

            'dataType': 'json'

        }).done(function (rsp) {

            if (rsp && rsp.status) {

                layer.alert(rsp.result.msg, {

                    time: 3000,

                    end: function () {

                        location.reload()

                    }
                });

            } else {

                layer.alert(rsp.result.msg);
            }
        });
    };


    return {
        save_goods_batch_no:save_goods_batch_no,
        showAllOrder:showAllOrder,
        showDetail:showDetail,
        batchConfirm:batchConfirm,
        checkAll:checkAll,
        batchStocking:batchStocking,
        popOrders:popOrders,
        showStocking:showStocking,
        flushStocking:flushStocking,
        batchToDoor:batchToDoor,
        confirmReceipt:confirmReceipt,
        userTakedelivery:userTakedelivery,
        showClerk:showClerk,
        goToDoor:goToDoor,
        setPageSize:setPageSize,
        showCountOrder: showCountOrder,
        showseller:showseller,
        showCommentDetail:showCommentDetail,
        sendSinceCode:sendSinceCode,
        showPayTradesByCashReceipts:showPayTradesByCashReceipts,
        showreportDown:showreportDown,
        showconfirmReceipt:showconfirmReceipt,
        birdExpress:birdExpress,
        birdExpressList:birdExpressList,
        getGoods:getGoods,
        cancelPush:cancelPush
    };
});

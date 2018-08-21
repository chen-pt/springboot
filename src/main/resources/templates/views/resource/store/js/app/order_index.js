/**
 * Created by boren on 15/8/20.
 */
require.config({
  paths: {
    'core': '../lovejs/core',
    'tools': '../lovejs/tools',
    'order': 'service/order',
    'create': 'service/createorder',
    'refund': 'service/refund'
  }
});


// 显示文本字数
function show_text_num() {
  try {
    document.getElementById("seller_memo_num").innerHTML = document.getElementById("seller_memo").value.length;
  } catch (e) {
  }
  document.getElementById("cash-receipt-note-text-num").innerHTML = document.getElementById("cash-receipt-note").value.length;
}


/**
 * 初始化
 */
$(function () {
  require(['core'], function (core) {
    //doT
    core.doTinit();
    //重写console
    core.ReConsole();
  });
  //消息提醒
  //setTimeout('order_message()',1000);
  // 路由
  var url = window.location.pathname;
  switch (url) {
    case '/order/index' :
      initIndex();
      break; //所有订单
    case '/order/todoor':
      initTodoor();
      break;//送货上门
    case '/order/detail' :
      initDetail();
      break;//订单详情
    case '/order/since' :
      initSince();
      break;//上门自己提
    case '/order/buying' :
      initBuying();
      break;//药房直购
    case '/order/deliverypay' :
      initDeliverypay();
      break;//货到付款
    case '/order/create' :
      initCreate();
      break;//创建订单
    case '/order/stocking':
      initStocking();
      break;//备货
    case '/order/delivery':
      initDelivery();
      break;//送货
    case '/order/userdelivery':
      initUserdelivery();
      break;//提货
    case '/order/count':
      initCountTrades();
      break;// 订单统计
    case '/order/agreeRefund':
      initRefund();
      break;
    case '/order/agreeRefund/initiative':
      initRefund();
      break;
    case '/order/refuseRefund':
      initRefund();
      break;
  }

  //查看图片
  $(document).on('click', '.small-img', function () {
    var src = $(this).find('input[name="big"]').val();
    layer.open({
      type: 1,
      title: false,
      closeBtn: true,
      shift: 0,
      area: ['auto', 'auto'],
      skin: 'layui-layer-molv',
      shadeClose: false,
      content: '<div><img src="' + src + '"/></div>'
    });
  });
  //所有订单修改备注弹出框按钮
  $(document).on('click', '.edit-memo', function () {

    // 获取订单ID
    var tradeid = $(this).find('input:hidden').val();
    // 获取订单备注
    var seller_memo = $(this).attr('original-title');
    // 获取订单radio
    var seller_flag = $(this).attr("data-flag");
    $('#tradeid').val(tradeid);
    $('#seller-modal').modal('show');
    $('.flag-box').find('input[value="' + seller_flag + '"]').attr('checked', true);
    $('#seller_memo').val(seller_memo);
    document.getElementById("seller_memo_num").innerHTML = document.getElementById("seller_memo").value.length;
  });
  //药房直购现金支付弹出框按钮
  $(document).on('click', '.btn_cash_receipt', function () {
    var trade_id = $(this).parents("table").find('input[id*="order"]').val();
    var cash_id = $(this).parents("table").find("label:eq(0)").html();
    var create_time = $(this).parents("table").find("label:eq(1)").html();
    var buyer_nick = $(this).parents("table").find("label:eq(2)").html();
    var cash_total = $(this).parents("tr").find("#cash-total").html();
    var linkSize = $(this).data('value');
    $("#trade-id").val(trade_id);
    $(".cash-title").html(cash_id);
    $(".create-time").html(create_time);
    $(".buyer-nick").html(buyer_nick);
    $("#cash-need").html(cash_total);
    $("#odd-change").html(0);
    $('#cash-receipt').modal('show');
    $('.cash-blur').val("");
    $('#cash-receipt-note').val("");
    $('#linkSize').val(linkSize);

  });
  ////药房直购现金支付取找钱值
  $(document).on('input', '.cash-blur', function () {
    var cash_payment_pay = parseFloat($("#cash-payment-pay").val() || 0);
    var medical_insurance_card_pay = parseFloat($("#medical-insurance-card-pay").val() || 0);
    var line_breaks_pay = parseFloat($("#line-breaks-pay").val() || 0);
    var cash_total = parseFloat($("#cash-need").html());
    var odd_change = (cash_payment_pay + medical_insurance_card_pay + line_breaks_pay - cash_total).toFixed(2);
    $("#odd-change").html(odd_change);
    if (odd_change < 0) {
      $(this).parents("#xxxx-form").find("#odd-change").css("color", "red");
    } else {
      $(this).parents("#xxxx-form").find("#odd-change").css("color", "#333");
    }

  });
  //处理打印小票弹地址

  if ($("#print_xiaopiao").prop("checked") == true) {

  }
  //所有订单导出报表弹出框按钮
  $(document).on('click', '.btn_reportDown', function () {
    var tid = $('#tid').val();
    var phone = $('#phone').val();
    var trades_status = $('#trades_status').val();
    var post_style = $('post_style').val();
    var clerk_invitation_code = $('#clerk_invitation_code').val();
    var start_time = $('#start_time').val();
    var end_time = $('#end_time').val();
    var trades_rank = $('#trades_rank').val();
    var pay_style = $('#pay_style').val();
    var total_items = $('#total_items_order').val();

    $("#reportDown").modal("show");
    $('#idDown').val(tid);
    $('#phoneDown').val(phone);
    $('#trades_statusDown').val(trades_status);
    $('#post_styleDown').val(post_style);
    $('#clerk_invitation_codeDown').val(clerk_invitation_code);
    $('#start_timeDown').val(start_time);
    $('#end_timeDown').val(end_time);
    $('#trades_rankDown').val(trades_rank);
    $('#pay_styleDown').val(pay_style);
    $('#total_items').val(total_items);
    $('#reportDown-text').html('');
    $('#reportDown-form .input-medium').val('');
    //导出报表
    reportDown();
  });
  //用户自提店长授权码弹出框按钮
  $(document).on('click', '.authcode-btn', function () {
    var trade_id = $(this).parents("table").find('input[id*="order"]').val();
    var since = $(this).data('value');


    $('#since').val(since)
    $("#trades_id").val(trade_id);
    $("#authcode-modal").modal("show");
    $('#auth_code').val('');
  })
});

/**
 * 所有订单
 * @param tradesid
 */
function initIndex() {
  require(['order'], function (order) {
    //order.showAllOrder('default','index',1);
    //商品下架备货
    $(document).on('click', '.down_goods', function () {//down_goods为下架时候备货按钮class
      $(".beihuo1").html("不能备货");
      $(".beihuo2").html("不能备货");
      $(".beihuo").html("知道了，继续备货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        index_stocking(kaxi);
      })
    })

    //商品下架发货
    $(document).on('click', '.send_goods', function () {//send_goods为下架时候开始发货按钮class
      $(".beihuo1").html("不能发货");
      $(".beihuo").html("知道了，继续发货");
      $(".beihuo2").html("不能发货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        index_DeliveryOne(kaxi);
      })
    })

  })

  //订单显示文本字数
  show_text_num();

  $(document).on('click', '#order_tabs li', function () {
    $(this).addClass('active').siblings().removeClass('active');
    var key = $(this).data("value");
    $("#trades_status").val(key);
    index_searchOrder();
  });

  require(['order'], function (order) {
    //所有订单
    order.showAllOrder('default', 'all', 1);
    // 现金支付
    load_cash_payment(order);
  });
}
//订单搜索
function index_searchOrder() {
  require(['order'], function (order) {
    order.showAllOrder('search', 'all', 1);
  });
}
//单个备货
function index_stocking(tradesid, status, kaxi) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchStocking(status || '', tradesid);
  });
}
//单个送货
function index_DeliveryOne(tradesid) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchToDoor('index', tradesid);
  });
}
/**
 * 订单详情
 * @param tradesid
 */
function initDetail() {
  require(['core', 'order'], function (core, order) {
    core.doTinit();
    var GET_COMMENT = 1;
    order.showDetail(GET_COMMENT);
    /**
     * 修改批次号
     */
    $(document).on('click', '.update_goods_batch_no', function () {
      $('#updateGoodsBatchNo [name="order_batch_no"]').val($(this).parent().find('[name="goods_batch_no"]').val());
      $('#updateGoodsBatchNo [name="goods_id"]').val($(this).parent().find('[name="goods_id"]').val());
      $('#updateGoodsBatchNo [name="order_id"]').val($(this).parent().find('[name="order_id"]').val());
    })

    $(document).on('click', '.save_goods_batch_no', function () {

      order.save_goods_batch_no();
    })
  });
}


/**
 * 送货上门订单
 * @param tradesid
 */
function initTodoor() {
  require(['order'], function (order) {
    order.showAllOrder('default', 'todoor', 1);
    //商品下架备货
    $(document).on('click', '.down_goods', function () {//down_goods为下架时候备货按钮class
      $(".beihuo1").html("不能备货");
      $(".beihuo2").html("不能备货");
      $(".beihuo").html("知道了，继续备货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        todoor_batchStocking(kaxi);
      })
    })

    //商品下架发货
    $(document).on('click', '.send_goods', function () {//send_goods为下架时候开始发货按钮class
      $(".beihuo1").html("不能发货");
      $(".beihuo").html("知道了，继续发货");
      $(".beihuo2").html("不能发货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        todoor_Delivery(kaxi);
      })
    })
  });
}
//送货上门订单--搜索
function todoor_SearchOrder() {
  require(['order'], function (order) {
    order.showAllOrder('search', 'todoor', 1);
  });
}
//送货上门订单--全选
function todoor_Checkitem(eml) {
  require(['order'], function (order) {
    order.checkAll(eml);
  });
}
//送货上门订单--单选了，取掉全选框的状态
function todoor_singleCheck(eml) {
  $('#checkall').prop("checked", false);
}
//送货上门订单--批量确认收货
function todoor_Confirmselect() {
  require(['order'], function (order) {
    order.batchConfirm();
    order.showAllOrder('default', 'todoor', 1);
  });
}
//送货上门订单--单个确认收货
function todoor_Confirm(tradesid, has_logistics) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    has_logistics = has_logistics ? 1 : 0;
    order.batchConfirm(has_logistics);
    order.showAllOrder('default', 'todoor', 1);
  });
}
//送货上门订单--批量备货
function todoor_batchStocking(kaxi) {
  require(['order'], function (order) {
    order.batchStocking('todoor', kaxi);
  });
}
//送货上门订单--单个备货

function todoor_stocking(tradesid) {

  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchStocking('todoor');//批量备货
  });
}
//送货上门订单--去送货
function todoor_Delivery(kaxi) {
  require(['order'], function (order) {
    order.batchToDoor('todoor', kaxi);
  });
}

//送货上门订单--单个送货
function todoor_DeliveryOne(tradesid) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchToDoor('todoor');
  });
}

/**
 * 上门自己提订单
 * @param tradesid
 */
function initSince() {
  require(['order'], function (order) {
    order.showAllOrder('default', 'since', 1);
    //确认提货
    authcodeDown(order);
    //商品下架备货
    $(document).on('click', '.down_goods', function () {//down_goods为下架时候备货按钮class
      $(".beihuo1").html("不能备货");
      $(".beihuo2").html("不能备货");
      $(".beihuo").html("知道了，继续备货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        todoor_batchStocking(kaxi);
      })
    })
    //商品提货
    $(document).on('click', '.ti_goods', function () {//down_goods为下架时候备货按钮class
      $(".beihuo1").html("不能提货");
      $(".beihuo2").html("不能提货");
      $(".beihuo").html("知道了，继续提货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        //todoor_batchStocking(kaxi);
        //var trade_id = $(this).parents("table").find('input[id*="order"]').val();
        var since = $(this).data('value');
        $('#since').val(since)
        $("#trades_id").val(kaxi);
        $("#authcode-modal").modal("show");
        $('#auth_code').val('');
      })
    })


  });
}
//上门自己提订单--订单搜索
function since_SearchOrder() {
  require(['order'], function (order) {
    order.showAllOrder('search', 'since', 1);
  });
}
//上门自己提订单--全选
function since_Checkitem(eml) {
  require(['order'], function (order) {
    order.checkAll(eml);
  });
}
//上门自己提订单--单选了，取掉全选框的状态
function since_singleCheck(eml) {
  $('#checkall').prop("checked", false);
}
//上门自己提订单--批量备货
function since_batchStocking() {
  require(['order'], function (order) {
    order.batchStocking('since');
  });
}
//上门自己提订单--单个备货
function since_stocking(tradesid) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchStocking('since');
  });
}
/**
 * 药房直购订单
 * @param tradesid
 */
function initBuying() {
  require(['order'], function (order) {
    //药房直购订单
    order.showAllOrder('default', 'buying', 1);
    // 现金支付
    load_cash_payment(order);
  });
}
//药房直购订单--订单搜索
function buying_SearchOrder() {
  require(['order'], function (order) {
    order.showAllOrder('search', 'buying', 1);
  });
}
//药房直购订单--确认提货
function buying_confirmReceipt(tradesid) {
  require(['order'], function (order) {
    $.confirm({
      'body': '您确认用户已提货了吗?',
      'okHide': function () {
        order.confirmReceipt(tradesid);
      }
    });
  });
}
/**
 * 货到付款订单
 * @param tradesid
 */
function initDeliverypay() {
  require(['order'], function (order) {
    //货到付款订单
    order.showAllOrder('default', 'all', 1, 180, '110,130,140,160,170,180');
    //商品下架备货
    $(document).on('click', '.down_goods', function () {//down_goods为下架时候备货按钮class
      $(".beihuo1").html("不能备货");
      $(".beihuo2").html("不能备货");
      $(".beihuo").html("知道了，继续备货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        var type = "deliverypay";
        deliverypay_stocking(kaxi, type);
      })
    })

    //商品下架发货
    $(document).on('click', '.send_goods', function () {//send_goods为下架时候开始发货按钮class
      $(".beihuo1").html("不能发货");
      $(".beihuo").html("知道了，继续发货");
      $(".beihuo2").html("不能发货");
      if ($(this).parent().find('[name="orderlist_length"]').val() > 1) {
        $(".much_goods").removeClass('hide');
        $(".single_goods").addClass('hide');
        $(".number_beihuo").html($(this).parent().find('[name="orderlist_length"]').val());
        $(".goods_name").html($(this).parent().find('[name="orderlist_goods"]').val());
      }
      $('#message_id').val($(this).parent().find("[name='message_id_down']").val());
      var kaxi = $('#message_id').val();//取到的trade_id
      $(".tuikuan").attr("href", "agreeRefund/initiative?tid=" + kaxi);
      $(document).on('click', '.beihuo', function () {
        var type = "deliverypay";
        deliverypay_DeliveryOne(kaxi, type);
      })
    })


  });
}
//货到付款订单--搜索
function deliverypay_SearchOrder() {
  require(['order'], function (order) {
    order.showAllOrder('search', 'all', 1, 180, '110,130,140,160,170,180');
  });
}
//货到付款订单--全选
function deliverypay_Checkitem(eml) {
  require(['order'], function (order) {
    order.checkAll(eml);
  });
}
//货到付款订单--单选了，取掉全选框的状态
function deliverypay_singleCheck(eml) {
  $('#checkall').prop("checked", false);
}
//货到付款订单--批量备货
function deliverypay_batchStocking(status) {
  require(['order'], function (order) {
    order.batchStocking(status);
  });
}
//货到付款订单--去送货
function deliverypay_Delivery(status) {
  require(['order'], function (order) {
    order.batchToDoor(status);
  });
}
//货到付款订单--单个备货
function deliverypay_stocking(tradesid, action) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchStocking(action);
  });
}
//货到付款订单--单个送货
function deliverypay_DeliveryOne(tradesid, action) {
  //选中单个订单
  $('#order_' + tradesid).prop("checked", true);
  require(['order'], function (order) {
    order.batchToDoor(action);
  });
}
/**
 * 现金收款
 * @@param tradesid
 */
function load_cash_payment(order) {
  $(function () {
    $('#xxxx-form').validate({
      'success': function () {
        order.showPayTradesByCashReceipts();
      }
    });
  });
}

/**
 * 创建订单
 */
function initCreate() {
  require(['order'], function (order) {
    order.showClerk();
  });
}
/**
 * 标题输入框值的变化
 */
function create_searchGood() {
  var item_title = $('#item_title').val();
  if (item_title != '') {
    require(['core', 'create'], function (core, create) {
      create.searchGoods();
    });
  }
}
/**
 * 选中值
 */
function create_Sureuse(good_id, title) {
  $('#item_title').val("");
  $('#search_lab').css('display', 'none');

  require(['create'], function (create) {
    create.addShopCar(good_id);
    create.showShopCar();
  });
}
/**
 * 清空商品框
 * @param item_title
 */
function create_Clear() {
  $('#item_title').val("");
}
/**
 * 购物车数量变化
 * @param opt
 * @param num
 */
function create_changeShopCar(good_id, num) {
  require(['create'], function (create) {
    var controlNum= $('#item_total_' + good_id).attr("controlNum");
    if(controlNum>0&&num==1){
      num=parseInt($('#nums_' + good_id).val())>=controlNum?0:num;
    }
    var item = create.changeShopCar('update', good_id, num);

    $('#nums_' + item.product_id).val(item.product_num);
    $('#item_total_' + item.product_id).html(((~~item.product_price * ~~item.product_num) / 100).toFixed(2));
    create_caluShopcar();
  });
}
/**
 * 进直输入值
 * @param good_id
 * @param value
 */
function create_inputChange(good_id, value) {
  require(['create'], function (create) {
    var control = $('#control_' + good_id).val();

    var controlNum= $('#item_total_' + good_id).attr("controlNum");
    if(controlNum>0){
      value=parseInt(value)>=parseInt(controlNum)?controlNum:value;
    }

    var item_val = create.ValidateinputChange(value, control);
    var item = create.changeShopCar('set', good_id, item_val);

    $('#nums_' + item.product_id).val(item.product_num);
    $('#item_total_' + item.product_id).html(((~~item.product_price * ~~item.product_num) / 100).toFixed(2));
    create_caluShopcar();
  });
}
/**
 * 删除购物车
 * @param good_id
 */
function create_delShopCar(good_id) {
  require(['create'], function (create) {
    create.delShopCar(good_id);
    create.showShopCar();
  });
}
/**
 * 计算购物车
 * @param good_id
 */
function create_caluShopcar() {
  require(['create'], function (create) {
    var item = create.CalculationShopCar();

    $('#item_num').html(item.item_num);
    $('#item_total').html((item.item_total / 100).toFixed(2));
  });
}

/**
 * 结算
 * @param good_id
 */
function create_Calculate() {
  require(['create', 'tools'], function (create, tools) {
    var mobile = $('#username').val();
    if (mobile.length!=11) {
      $.alert({'title': '温馨提示!', 'backdrop': 'static', 'body': '手机号码格式不正确！'});
      return;
    }
    if (Object.keys(create.shopcar).length > 0) {
      $('#username').attr("disabled", "disabled");
      $('#item_title').attr("disabled", "disabled");
      $('#sotore_worker').attr("disabled", "disabled");
      $('#clerk_list').addClass('disabled');

      create.calculate(mobile, 0);
    } else {
      $.alert({'title': '温馨提示!', 'backdrop': 'static', 'body': '请先添加商品哦！'});
    }
  });
}


/**
 * 用户输入积分
 * @param mobile
 */
function createIntegralChange() {
  require(['create'], function (create) {
    var mobile = $('#username').val();
    var integral_use = Number($('#integral_use').val());
    var control_integral = Number($('#control_integral').val());
    if (isNaN(integral_use) || integral_use == 0) {
      integral_use = 0;
      $('#integral_use').val("")
      return;
    } else {
      if (integral_use > control_integral) {
        integral_use = control_integral;
      }
    }
    create.calculate(mobile, integral_use);
  });
}

/**
 * 下单
 * @param mobile
 */
function create_Commit() {
  require(['core', 'create'], function (core, create) {
    var mobile = $('#username').val();
    var integral_use = $('#integral_use').val();
    var storeUserId = $('#clerk_select option:selected').val()
    var status = create.commitOrder(mobile, integral_use, storeUserId);

    if (status) {
      window.location.href = core.getHost() + '/store/order/deliverypay';
    }
  });
}

/**
 * 验证会员
 * @param mobile
 */
function create_checkUser() {
  var mobile = $('#username').val();

  require(['create'], function (create) {
    create.checkUser(mobile);
  });
}

/**
 * 备货
 * @param stocking
 */
function initStocking() {
  require(['order'], function (order) {
    order.showStocking();
  });
}
/**
 * 完成备货
 * @param completestock
 */
function stocking_completeStock() {
  require(['order'], function (order) {
    order.flushStocking();
  });
}
/**
 * 送货
 * @param delivery
 */
function initDelivery() {
  require(['order'], function (order) {
    order.showStocking();
    order.showClerk();
  });
}
/**
 * 选择送货员
 * @param mobile
 */
function delviery_clerkselect(mobile) {
  console.log('手机:' + mobile);
  $('#clerk_mobile').html(mobile);
}
/**
 * 去送货
 * @param deviery_send
 */
function deviery_send() {
  require(['order'], function (order) {
    order.goToDoor();
  });
}

/**
 * 提货
 * @param userdelivery
 */
function initUserdelivery() {
  //暂时哈也不干
}
/**
 * 验证提货码
 * @ @param order
 */
function userdelivery_checkCode() {
  require(['order', 'tools'], function (order, tools) {
    var code = $('#dely_code').val();
    if (tools.validate('member', code, null)) {
      order.userTakedelivery(code);
    } else {
      $.alert({'title': '温馨提示!', 'body': '提货码输入有误，请重新输入！'});
    }
  });
}

/**
 * 消息提醒
 */
function order_message() {
  require(['core'], function (core) {
    var postdata = {};
    postdata.time = 1;

    $.ajax({
      type: 'POST',
      data: postdata,
      url: core.getHost() + '/order/orderMessage',
      dataType: 'json',
      success: function (data) {
        if (data.status) {
          if (navigator.userAgent.indexOf("Firefox") > 0) {
            var str = '<audio autoplay="autoplay" src="' + SOURCE_URL + '/store/static/mp3/order.mp3"> </audio>';

            $("#music").empty().prepend(str);
          } else {
            $("#music").empty().prepend('<Embed id="music_play" src="' + SOURCE_URL + '/store/static/mp3/order.mp3" width="0" height="0" AUTOSTART="TURE" LOOP="FALSE"></Embed>');
          }
          //关闭前一个弹框
          $('.modal-content').parents('[role=dialog]').modal('hide');
          //弹框提示
          $.alert({
            'title': '订单消息',
            'backdrop': 'static',
            'okBtn': '好的',
            'body': '<h2 class="sui-text-danger">您有新订单，请及时处理！</h2>'
          });
        }
        setTimeout('order_message()', postdata.time * 60 * 1000);
      }
    });
  });
}

/**
 * 发送提货码
 * @param tradesid
 */
function buying_sendCode(tradesid) {
  require(['order'], function (order) {
    order.sendSinceCode(tradesid);
  });
}

/**
 * 订单统计
 */
function initCountTrades() {
  require(['order'], function (order) {
    order.showCountOrder(1);
    // 搜索按钮的单击事件
    $(document).on('click', '#trade-count-search', function () {
      order.showCountOrder(1);
    });
  });
}

/**
 * 订单备注
 * @param tradesid
 */
function sellerBtn() {
  require(['order'], function (order) {
    order.showseller();
  });
}

/**
 * 条形码搜索商品
 * @param tradesid
 */
function bar_Code_search() {
  require(['core', 'create'], function (core, create) {
    var bar_code = $('#bar_code').val();

    if (!/^\d+$/.test(bar_code)) {
      alert('请输入有效的条形码，条形码为纯数字组合');
      return;
    }
    $.ajax({
      'url': core.getHost() + '/order/getProductBybarCode',
      'type': 'post',
      'data': {
        'bar_code': bar_code
      },
      'dataType': 'json'
    }).done(function (rsp) {
      if (rsp.status && rsp.result.items.length) {
        create.addShopCar(rsp.result.items[0].goods_id);
        create.showShopCar();
      } else {
        alert('没有找到对应的商品');
      }
    });
  });
}

/**
 * 订单刷新状态.
 * @param tradesid
 */
function refreshStatus() {
  var trades_id = $('#tradeid').val();
  require(['core'], function (core) {
    $.ajax({
      'url': core.getHost() + '/order/refreshTradesPayStatus',
      'type': 'post',
      'dataType': 'json',
      'data': {
        'trades_id': trades_id
      }
    }).done(function (rsp) {
      if (rsp.status) {
        location.reload();
      } else {
        $.alert({
          'body': '刷新失败，订单还未付款，请稍后再试'
        })
      }
    });
  });
}

/**
 * 订单退款
 * @param tradesid
 */
function initRefund() {
  /*require(['core'], function(core) {
   // 同意/不同意退款
   $(document).on('click', '.handle-refund', function(evt) {

   evt.preventDefault();
   });
   });*/
  require(['core', 'refund'], function (core, refund) {
    refund.init();

    $(function () {
      ready(refund);
      // 表单提交
      // 添加表单验证规则
      $.validate.setRule('express', function (value, $element, param) {
        return /^\d{6,20}$/.test(value);
      }, '请输入正确的快递单号');
      $.validate.setRule('min', function (value, $element, param) {
        return !(value < param);
      }, '退款金额不能小于0.01元');

      $('#refund-form').validate({
        'success': function ($form) {
          refund.handleRefund($form.serializeArray());
        }
      });
    });
  });
  function ready(refund) {
    $('#real_refund_money,#refund_cash,#refund_health_insurance').autoNumeric('init', {
      'aSep': 0,
      'mDec': null,
      'aPad': 2
    });

    $('#img-url').on('load', function () {
      var rsp = this.contentDocument.body.innerHTML;
      try {
        rsp = JSON.parse(rsp);
      } catch (e) {
        rsp = {'status': false, 'result': {'msg': '上传失败'}}
      }
      if (rsp.status) {
        refund.addCe(rsp.result.imgurl);
      } else {
        // 上传失败
        layer.alert(rsp.result.msg);
      }
    });
  }

  // 没有用的玩意
  $(document).on('submit', '#temp-file-form', function (a) {
    console.log(a);
  });
}

/**
 *导出报表
 * @param tradesid
 */
function reportDown() {
  require(['order'], function (order) {
    order.showreportDown();
  });
}

/**
 * 用户自提店长授权码
 * **/
function authcodeDown(order) {
  $(function () {
    $('#authcode-form').validate({
      'success': function () {
        order.showconfirmReceipt();
      }
    });
  });
}

//通知取货按钮事件
require(['order'], function (order) {
  $(document).on('click', '#express_btn', (function () {
    var t = false;

    return function () {

      if (t) return false;

      t = true;

      order.birdExpress().always(function () {
        t = false;
      });
    };
  }()));
});

//查看物流信息的按钮
$(document).on('click', '.express_alert', function () {

  var thisObj = $(this);

  require(['order'], function (order) {

    var trade_id = thisObj.siblings('input[name="trades_id"]').val();

    order.birdExpressList(trade_id);
  });
})

//确认快递员取货
$(document).on('click', '.get_goods', function () {
  layer.closeAll();
  var thisObj = $(this);

  require(['order'], function (order) {

    var post = {};

    post.log_num = thisObj.siblings('input[name="log_num"]').val();

    post.log_id = 8;

    post.trades_id = thisObj.siblings('input[name="trades_id"]').val();

    post.has_logistics = 1;

    var data = jQuery.param(post);

    order.getGoods(data);
  })
});

//确认送达trades
$(document).on('click', '.send_goods', function () {

  layer.closeAll();

  var trades = $(this).siblings('input[name="trades_id"]').val();

  todoor_Confirm(trades, 1)
});
require(['order'], function (order) {

  $(document).on('click', '.cancel_btn', (function () {
    var t = false;

    return function () {

      if (t) return false;

      t = true;

      layer.closeAll();
      var thisObj = $(this);

      var trades = thisObj.siblings('input[name="trades_id"]').val();

      order.cancelPush(trades).always(function () {
        t = false;
      });

    }

  })())

})

function hideSearchLab() {
  $('#search_lab').hide();
}

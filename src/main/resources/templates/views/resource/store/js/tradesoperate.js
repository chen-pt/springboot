//用户自提店长授权码弹出框按钮
function showStorePickGood(trade_id) {
  $("#trades_id").val(trade_id);
  $("#authcode-modal").modal("show");
  $('#auth_code').val('');
  $("#authcode-form").attr("action", 'javascript:storePickGood();');
}
//送货上门确认收货店长授权码弹出框按钮
function showComfirmReceive(trade_id) {
  $("#trades_id").val(trade_id);
  $("#authcode-modal").modal("show");
  $('#auth_code').val('');
  $("#authcode-form").attr("action", 'javascript:comfirmReceive();');
}
//确认提货
function storePickGood() {
  var postdata = {};
  postdata.storeAuthCode = $('#auth_code').val();
  postdata.tradesId = $('#trades_id').val();
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/storePickGood',
    success: function (data) {
      if (data.code == '000') {
        layer.msg('提货成功，谢谢！', function () {
          location.replace(location.href);
          var num = $('.sui-pagination li.active a').html();
          $('#authcode-modal').modal('hide');
          select(num);
        });
      } else if ((data.code == '101')) {
        layer.msg(data.message);
      } else {
        layer.msg('提货失败！');
      }
    }
  });
}

//药房直购现金支付弹出框按钮
function showCashReceipt(tradesId) {
  // var trade_id = $("table[tradesid='"+tradesId+"']").find('input[id*="order"]').val();
  var cash_id = $("table[tradesid='" + tradesId + "']").find("label:eq(0)").html();
  var create_time = $("table[tradesid='" + tradesId + "']").find("label:eq(1)").html();
  var buyer_nick = $("table[tradesid='" + tradesId + "']").find("label:eq(2)").html();
  var cash_total = $("table[tradesid='" + tradesId + "']").find("#cash-total").html();
  $("#trade-id").val(tradesId);
  $(".cash-title").html(cash_id);
  $(".cash-title").find(":checkbox").remove();
  $(".create-time").html(create_time);
  $(".buyer-nick").html(buyer_nick);
  $("#cash-need").html(cash_total);
  $("#odd-change").html(0);
  $('#cash-receipt').modal('show');
  $('.cash-blur').val("");
  $('#cash-receipt-note').val("");
}
//药房直购现金支付
function cashReceipt() {
  var cash_payment_pay = parseFloat($("#cash-payment-pay").val() || 0);
  var medical_insurance_card_pay = parseFloat($("#medical-insurance-card-pay").val() || 0);
  var line_breaks_pay = parseFloat($("#line-breaks-pay").val() || 0);
  var cash_total = parseFloat($("#cash-need").html());
  var odd_change = (cash_payment_pay + medical_insurance_card_pay + line_breaks_pay - cash_total).toFixed(2);
  if (odd_change < 0) {
    layer.msg("找零金额不能小于零");
    return;
  }

  if (line_breaks_pay > cash_total) {
    layer.msg("优惠金额必须小于实付金额");
    return;
  }
  if (medical_insurance_card_pay > cash_total - line_breaks_pay) {
    layer.msg("医保金额不能大于实付金额减优惠金额");
    return;
  }
  var postdata = {};
  postdata.tradesId = $("#trade-id").val();
  postdata.cashPaymentPay = cash_payment_pay;
  postdata.medicalInsuranceCardPay = medical_insurance_card_pay;
  postdata.lineBreaksPay = line_breaks_pay;
  postdata.cashReceiptNote = $("#cash-receipt-note").val();
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/directPurchaseStatus',
    success: function (data) {
      if (data.code == '000') {
        layer.msg("付款成功，谢谢！", function () {
          location.replace(location.href);
          var num = $('.sui-pagination li.active a').html();
          select(num);
          $('#cash-receipt').modal('hide');
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '付款失败！'});
      }
    }
  });
}

// 显示文本字数
function show_text_num() {
  try {
    document.getElementById("seller_memo_num").innerHTML = document.getElementById("seller_memo").value.length;
  } catch (e) {
  }
  document.getElementById("cash-receipt-note-text-num").innerHTML = document.getElementById("cash-receipt-note").value.length;
}


//校验提货码
function userdelivery_checkCode() {
  var postdata = {};
  postdata.selfTakenCode = $("#dely_code").val();
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/validationSelfTakenCode',
    success: function (data) {
      if (data.code == '000') {
        var tmpl = document.getElementById('userdelivery_order').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $(".order-list").html(doTtmpl(data));
        $("#pick_good").show();
        $("#trades_id").val(data.value.tradesId);
        $("#tradesStatus").val(data.value.tradesStatus);
        $("#assignedStores").val(data.value.assignedStores);
        $("#self_taken_flag").val(data.value.self_taken_flag);
        $(".curr_store_name").text("【"+data.value.store.name+"】");
      } else {
        $.alert({'title': '温馨提示!', 'body': data.message});
      }
    }
  });
}

$("#dely_code").focus(function () {
  $("#trades_id").val("");
  $("#tradesStatus").val("");
  $("#dely_code").val("");
  $("#pick_good").hide();
  $(".order-list").empty();
});

function pickGoodTip() {
  // alert($("#tradesStatus").val());
  if($("#tradesStatus").val()==120){
    $("#pickGoodTip").modal('show');
  }else {
    pickGood();
  }
}

function takenTip() {
  // alert($("#tradesStatus").val());
  //判断订单是否在当前门店
  if ($("#assignedStores").val() == $("#storeId").val()) {
    if ($("#tradesStatus").val() == 120) {//判断订单是否已备货
      $("#my_modal_2").modal('show');
    } else {
      $("#my_modal_1").modal('show');
    }
  } else {
    if ($("#self_taken_flag").val() == 0) {//`self_taken_flag`  '提货方式（0：允许任意门店提货，1：只能在下单门店提货）'
      if ($("#tradesStatus").val() == 120) {//判断订单是否已备货
        $("#my_modal_4").modal('show');
      } else {
        $("#my_modal_3").modal('show');
      }
    } else {
      $("#my_modal_5").modal('show');
    }
  }
}

function pickGoodTipOK(obj) {
  pickGood();
}

//用户自提
function pickGood() {
  var postdata = {};
  postdata.tradesId = $("#trades_id").val();
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/pickGood',
    success: function (data) {
      if (data.code == '000') {
        $.alert({'title': '温馨提示!', 'body': '用户提货成功！'}).on('hidden', function () {
          window.location.href = "/store/order/index";
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '用户提货失败！'});
      }
    }
  });
}

//加载送货人数据
function getStoreClerkData() {
  $.ajax({
    type: 'POST',
    data: {},
    url: '/store/clerk/list',
    success: function (data) {
      for (var i = 0; i < data.length; ++i) {
        $("#clert_select").append('<option value="' + data[i].storeadmin_id + '">' + data[i].clerkName + '</option>');
      }
      $("#clert_select").trigger("change");
    }
  });
}
//加载快递公司数据
function getDeliveryData() {
  $.ajax({
    type: 'POST',
    data: {},
    url: '/store/deliveryList',
    success: function (data) {
      if (data.status) {
        for (var i = 0; i < data.result.length; ++i) {
          $("#delivery_select").append('<option value="' + data.result[i].id + '">' + data.result[i].name + '</option>');
        }
      }
    }
  });
}
//确认发货
function send(type) {
  var postdata = {};
  postdata.type = type;
  postdata.tradesId = $("#trades_id").val();
  postdata.store_shipping_clerk_id = $("#clert_select").val();
  postdata.post_name = $("#delivery_select option:selected").text();
  postdata.post_number = $("#delivery_code").val();
  if (type == 2 && !postdata.store_shipping_clerk_id) {
    $.alert({'title': '温馨提示!', 'body': '请选择送货人员'});
    return;
  }
  if (type == 3 && !postdata.post_name) {
    $.alert({'title': '温馨提示!', 'body': '请选择送快递公司'});
    return;
  }
  if (type == 3 && !postdata.post_number) {
    $.alert({'title': '温馨提示!', 'body': '请填写快递单号'});
    return;
  }
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/toDoorShipping',
    success: function (data) {
      if (data.code == '000') {
        $.alert({'title': '温馨提示!', 'body': '确认发货成功！'}).on('hidden', function () {
          window.location.href = "/store/order/index";
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '确认发货失败！'});
      }
    }
  });
}
//门店自提确认备货
function comfirmStocking() {
  var starttime = $("#start_time").val();
  var endtime = $("#end_time").val();
  if (isDateTime(starttime) && isDateTime(starttime)) {
    if (new Date(starttime) >= new Date(endtime)) {
      $.alert({'title': '温馨提示!', 'body': "开始时间不能大于等于结束时间"});
      return;
    }
    var postdata = {};
    postdata.tradesId = $("#trades_id").val();
    postdata.selfTakenCodeStart = starttime;
    postdata.selfTakenCodeExpires = endtime;
    $.ajax({
      type: 'POST',
      data: postdata,
      url: '/store/order/toStoreStockup',
      success: function (data) {
        if (data.code == '000') {
          $.alert({'title': '温馨提示!', 'body': '备货成功！'}).on('hidden', function () {
            window.location.href = "/store/order/index";
          });
        } else if ((data.code == '101')) {
          $.alert({'title': '温馨提示!', 'body': data.message});
        } else {
          $.alert({'title': '温馨提示!', 'body': '备货失败！'})
        }
      }
    });
  } else {
    $.alert({'title': '温馨提示!', 'body': "对不起，您输入的日期格式不正确!正确格式：2000-12-12 12:12"});
  }
}
//送货上门备货
function comfirmStockupDeliver() {
  var postdata = {};
  postdata.tradesId = $("#trades_id").val();
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/stockupDeliver',
    success: function (data) {
      if (data.code == '000') {
        $.alert({'title': '温馨提示!', 'body': '备货成功！'}).on('hidden', function () {
          var num = $('.sui-pagination li.active a').html();
          window.location.href = "/store/order/index";
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '备货失败！'});
      }
    }
  });
}

//确认收货
function comfirmReceive() {
  var postdata = {};
  postdata.storeAuthCode = $('#auth_code').val();
  postdata.tradesId = $("#trades_id").val();
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/stockupReceived',
    success: function (data) {
      if (data.code == '000') {
        layer.msg('确认收货成功，谢谢！', function () {
          var num = $('.sui-pagination li.active a').html();
          $('#authcode-modal').modal('hide');
          select(num);
        });
      } else if ((data.code == '101')) {
        layer.msg(data.message);
      } else {
        layer.msg('确认收货失败！');
      }
    }
  });
}

function cancelStockupTip(trades_id) {
  $("#stockupTradesId").val(trades_id);
  $("#cancelStockupTip").modal('show');
}

function tipCancelStockupOK(obj) {
  // alert($("#stockupTradesId").val());
  var postdata = {tradesId:$("#stockupTradesId").val()};
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/cancelStockup',
    success: function (data) {
      if (data.status == 'ok') {
        $.alert({'title': '温馨提示!', 'body': '取消备货成功！'}).on('hidden', function () {
          location.replace(location.href);
          var num = $('.sui-pagination li.active a').html();
          select(num);
        });
      } else {
        $.alert({'title': '温馨提示!', 'body': '取消备货失败！'});
      }
    }
  });
}

function closeOrderTip(trades_id) {
  $("#tip-tradesId").val(trades_id);
  $("#tip").modal('show');
}

function tipOK(obj) {
  closeOrder($("#tip-tradesId").val());
}
//修改价格
function modifyOrderPrice(trades_id,oldPrice) {
  $("#editPrice").val("");
  $("#editRemark").val("");
  $.ajax({
    type: "get",
    url: "/store/isupdatePrice",
    success: function (date) {
      if (date) {
        $("#modifyPrice").modal('show');
        $("#oldPrice").text(oldPrice);
        $("#tradesId").val(trades_id);
      }else {
        $("#role").modal('show');
      }
    }
  });
}
//修改价格
function modifyPrinceOK(obj) {
  var tradesId = $("#tradesId").val();
  var editPrice = $("#editPrice").val();
  var editRemark = $("#editRemark").val() ;
  $.ajax({
    type: 'POST',
    data: { tradesId:tradesId,price:editPrice,remark:editRemark},
    url: '/store/order/modifyPrice',
    success: function (data) {
      if (data.code == '000') {
        $.alert({'title': '温馨提示!', 'body': '修改价格成功！'}).on('hidden', function () {
          location.replace(location.href);
          var num = $('.sui-pagination li.active a').html();
          select(num);
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '修改价格失败！'});
      }
    }
  });
}

//关闭订单
function closeOrder(trades_id) {
  var postdata = {};
  postdata.tradesId = trades_id;
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/close',
    success: function (data) {
      if (data.code == '000') {
        $.alert({'title': '温馨提示!', 'body': '关闭订单成功！'}).on('hidden', function () {
          location.replace(location.href);
          var num = $('.sui-pagination li.active a').html();
          select(num);
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '关闭订单失败！'});
      }
    }
  });
}

//发送提货码
function sendCode(trades_id) {
  var postdata = {};
  postdata.tradesId = trades_id;
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/manualGenerateBar',
    success: function (data) {
      if (data.code == '000') {
        layer.msg('发送成功！');
      } else if ((data.code == '101')) {
        layer.msg(data.message);
      } else {
        layer.msg('发送失败！');
      }
    }
  });
}

function isDateTime(date) {
  var str = date.trim();
  if (str.length != 0) {
    var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2})$/;
    var r = str.match(reg);
    return r;
  }
}
//批量确认收货
function batchConfirmStockup() {
  var postdata = {};
  var tradesIds = "";
  $("input[id^='order']").each(function (i, obj) {
    if (obj.checked) {
      tradesIds += $(obj).val() + ","
    }
  })
  if (!tradesIds) {
    layer.msg("必须选择一条数据");
    return;
  }
  postdata.tradesIds = tradesIds.substring(0, tradesIds.length - 1);
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/toDoorBatchConfirmStockup',
    success: function (data) {
      if (data.code == '000') {
        $.alert({'title': '温馨提示!', 'body': "批量确认收货成功！"}).on('hidden', function () {
          var num = $('.sui-pagination li.active a').html();
          select(num);
        });
      } else if ((data.code == '101')) {
        $.alert({'title': '温馨提示!', 'body': data.message});
      } else {
        $.alert({'title': '温馨提示!', 'body': '批量确认收货失败！'});
      }
    }
  });
}
//是否显示蜂鸟配送
function showFengNiao() {
  $("#fengniao1").hide();
  $("#fengniao2").hide();
  $.ajax({
    type: 'POST',
    data: {},
    url: '/store/order/getFengNiaoSetting',
    success: function (data) {
      if (data.value) {
        $("#fengniao1").show();
        if (data.value.siteId == 100166) {
          $("#imIcon").show();
        }
      } else {
        $("#fengniao2").show();
      }
    }
  });
  // $("#fengniao1").show();
  // //$("#fengniao1").hide();
  //   $("#fengniao2").hide();
}

$(document).ready(function () {
  if ($("#fengniao1").length > 0) {
    showFengNiao();
  }

  if ($("#cash-receipt").length > 0) {
    $("input.cash-blur").bind('input', function () {
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
  }
  if ($("#comfirm_stocking").length > 0) {
    if ($("#postStyle").val() != 160) {
      $("#takentime").hide();
      $("#comfirm_stocking").click(function () {
        comfirmStockupDeliver();
      });
    } else {
      $("#comfirm_stocking").click(function () {
        comfirmStocking();
      });
    }
  }

  if ($("#clert_send_btn").length > 0) {
    $("#clert_send_btn").click(function () {
      send(2);
    });
  }
  if ($("#notify_send_btn").length > 0) {
    $("#notify_send_btn").click(function () {
      send(1);
    });
  }
  if ($("#delivery_send_btn").length > 0) {
    $("#delivery_send_btn").click(function () {
      send(3);
    });
  }
  if ($("#delivery_select").length > 0) {
    getDeliveryData();
  }
  setTimeout('order_message()', 1000);
  //setInterval('order_message()',1000*60);
  if ($("#clert_phone").length > 0) {
    getStoreClerkData();
    $("#clert_select").change(function () {
      $.ajax({
        type: 'POST',
        data: {},
        url: '/store/clerk/clerkinfo/' + $('#clert_select option:selected').val(),
        success: function (data) {
          $("#clert_phone").html(data.mobile);
        }
      });
    });
  }
});
//所有订单导出报表弹出框按钮
$(document).on('click', '.btn_reportDown', function () {

  var selectType = $("#selectType").val();
  if(selectType=="tradesId"){
    var tid = $('#text').val();
  }else if(selectType=="phone"){
    var phone = $('#text').val();
  }

  var trades_status = $('#tradesStatus').val();
  var post_style = $('#postStyle').val();
  var clerk_invitation_code = $('#clerkInvitationCode').val();
  var start_time = $('#start_time').val();
  var end_time = $('#end_time').val();
  var trades_rank = $('#trades_rank').val();
  var pay_style = $('#payStyle').val();
  var total_items = $('#total_items_order').val();
  var tradesSource = $('#tradesSource').val();

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
  $('#tradesSourceDown').val(tradesSource);
  $('#reportDown-form .input-medium').val('');
  //导出报表
  reportDown();
});

var searchReport = function (flag) {
  var selectType = $("#selectType").val();
  if(selectType=="tradesId"){
    var tid = $('#text').val();
  }else if(selectType=="phone"){
    var phone = $('#text').val();
  }

  var trades_status = $('#tradesStatus').val();
  var post_style = $('#postStyle').val();
  var clerk_invitation_code = $('#clerkInvitationCode').val();
  var start_time = $('#start_time').val();
  var end_time = $('#end_time').val();
  var trades_rank = $('#trades_rank').val();
  var pay_style = $('#payStyle').val();
  var total_items = $('#total_items_order').val();
  var tradesSource = $('#tradesSource').val();

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
  $('#tradesSourceDown').val(tradesSource);
  $('#reportDown-form .input-medium').val('');
  //导出报表
  reportDown(flag);
};

//下载报表
function reportDown(flag) {
  var postdata = {};
  postdata.tradesId = $('#idDown').val();
  postdata.mobile = $('#phoneDown').val();
  //postdata.tradesStatus = $('#trades_statusDown').val();
  postdata.postStyle = $('#post_styleDown').val();
  postdata.selfTakenCode = $('#clerk_invitation_codeDown').val();
  postdata.orderTimeStart = $('#start_timeDown').val();
  postdata.orderTimeEnd = $('#end_timeDown').val();
  postdata.commentRank = $('#trades_rankDown').val();
  postdata.payStyle = $('#pay_styleDown').val();
  postdata.total_items = $('#total_items').val();
  postdata.tradesFlag = $("#tradesFlag").val();
  postdata.tradesSource = $('#tradesSourceDown').val();
  postdata.reportType = 1;
  postdata.newTradesStatus= $('#tradesStatusNew').val();
  //导出报表正在处理，请稍后
  $('#reportDown-text').html("正在处理，请稍后.....");
  if ($('#total_items').val() > 2000) {
    $('#reportDown-text').html('<div>查询结果<span class="sui-text-danger">' + (postdata.total_items ? postdata.total_items : 0) + '</span>条订单，超过导出最大值！</div><div>请修改查询时间后再试哦~</div><div class="sui-text-danger">*每次最多可以导出2000条，超过时请分批次下载</div>');
  } else {
    if (flag === 0) {
      $('#reportDown-text').html('共查询到 <span class="sui-text-danger">' + (postdata.total_items ? postdata.total_items : 0) + '</span> 条订单，<a href="/trades/goodsReport?' + $.param(postdata) + '">点击下载报表</a>');
    } else {
      $('#reportDown-text').html('共查询到 <span class="sui-text-danger">' + (postdata.total_items ? postdata.total_items : 0) + '</span> 条订单，<a href="/trades/report?' + $.param(postdata) + '">点击下载报表</a>');
    }
  }
}
//显示保存商家备注弹框
function showAaveComment(trade_id) {
  $('#seller_memo').val("");
  var getTradeDetailUrl = "/store/order/selectTradesDetails2?tradesId=" + trade_id;
  $.get(getTradeDetailUrl, function (res) {
    if (res && res.value) {
      $("#flag" + res.value.sellerFlag).prop('checked', true);
      // $("#flag" + res.value.sellerFlag)[0].checked = true;
      if (res.value.sellerMemo && res.value.sellerMemo != 'NULL')
        $('#seller_memo').val(res.value.sellerMemo);
      show_text_num();
    } else {
      $('#seller_memo').val("");
    }
  });
  $("#seller-modal").modal("show");
  $("#tradeid").val(trade_id);
  $(".comment-btn-save").click(function () {
    saveComment();
  });
}

//保存商家备注
function saveComment() {
  var data = {};
  data.sellerFlag = $('[name="seller_flag"]:checked').val();
  data.sellerMemo = $('#seller_memo').val();
  data.tradesId = $("#tradeid").val();
  if (!data.sellerFlag) {
    layer.msg("请选择旗帜");
    return;
  }
  if (!data.sellerMemo) {
    layer.msg("请填写备注");
    return;
  }
  $.post("./updateSellerMemo", data, function (res) {
    if (res && res.code == "000") {
      layer.msg("更新成功");
      $("#seller-modal").modal("hide");
      var num = $('.sui-pagination li.active a').html();
      select(num);
    }
  })
}

function checkAll() {
  var ischecked = $('#checkall').is(':checked');

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
}

function checkItem(id) {
  var ischecked = $('#' + id).is(':checked');
  if (ischecked) {
    $(":checkbox").each(function () {
      if ($(this).attr('id') != 'checkall') {
        if (!$(this).prop("checked")) {
          $("#checkall").prop("checked", false);
          return;
        } else {
          $("#checkall").prop("checked", ischecked);
        }
      }
    });
  } else {
    $("#checkall").prop("checked", ischecked);
  }
}


/**
 * 消息提醒
 */
function order_message() {
  var postdata = {};
  postdata.time = 1;
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/store/order/getLastTrades',
    dataType: 'json',
    success: function (data) {
      if (data && data.code == "000" && data.value.code == 200) {
        $.ajax({
          type: 'POST',
          data: postdata,
          url: '/store/order/getOrderRemind',
          dataType: 'json',
          success: function (set) {
            if (set && set.code == "000" && set.value.order_pc_alert == 1) {
              //关闭前一个弹框
              $('.modal-content').parents('[role=dialog]').modal('hide');

              console.log("订单号"+data.value.data[0].tradesId);
              var tips = '<div class="clearfix" style="width: 300px; margin:auto;">'
                  +'<img style="width: 50px; margin: 15px 15px 0 0" src="/templates/views/resource/merchant/img/img_neworder.png" class="pull-left">'
                  +'<div style="overflow:hidden"><div STYLE="font-size: 15px;font-weight: 600;margin: 10px auto 0 auto">您有新订单，请及时处理！</div>'
                  +'<div id="look_new_order" style="margin: 10px auto 0 auto">'
                  +'<a href="/store/order/selectTradesDetails?tradesId='+ data.value.data[0].tradesId + '"  style = "font-size: 14px;">查看订单详情</a></div>'
                  +'</div></div>';

              //弹框提示
              $.alert({
                'title': '订单消息',
                'backdrop': 'static',
                'okBtn': '好的',
                'body': tips
              });
            }
            if (set && set.code == "000" && set.value.order_voice_alert == 1) {
              if (navigator.userAgent.indexOf("Firefox") > 0) {
                var str = '<audio autoplay="autoplay" src="/templates/views/resource/store/mp3/order.mp3"> </audio>';

                $("#music").empty().prepend(str);
              } else {
                $("#music").empty().prepend('<Embed id="music_play" src="/templates/views/resource/store/mp3/order.mp3" width="0" height="0" AUTOSTART="TURE" LOOP="FALSE"></Embed>');
              }
            }
          }
        });
      }
      setTimeout('order_message()', postdata.time * 60 * 1000);
    }
  });
}

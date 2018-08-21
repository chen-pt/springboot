$(document).ready(function () {
  tradesObj.doTinit();

  $.get("/merchant/storelist", function (res) {
    console.debug(res);
    var tmpl = document.getElementById('stores_list').innerHTML;
    var doTtmpl = doT.template(tmpl);

    $('#stores_opt').html(doTtmpl(res));
  });

  tradesObj.getTradesList();
  tradesObj.queryCountBtn==1;
  tradesObj.getPaytime();
  /*tradesObj.getGroupInfo();*/

  $(".search-trades-btn").click(function () {
    tradesObj.queryCountBtn=1;
    tradesObj.getTradesList();
  });
  $("#search_report").click(function () {

    if(tradesObj.totalTrades>2000){
      $(".export-report").html("根据本次查询条件，共查询到"+tradesObj.totalTrades+"条结果,已超过&nbsp;2000&nbsp;条的最大值，请修改查询条件，分批次下载。");
      $("#export_list").modal("show");
      return;
    }else if(tradesObj.totalTrades<=0){
      $(".export-report").html("根据本次查询条件，未查询到相关订单信息！");
      $("#export_list").modal("show");
      return;
    }

    $(".export-report").html("根据本次查询条件，共查询到" + tradesObj.totalTrades + "条结果,请<a id = 'do-export'>点击下载</a>。");

    $("#export_list").modal("show");

    $("#do-export").click(function () {
      tradesObj.exportReport(tradesObj.siteId);

    });
    //TODO
    //$("#export_list").modal("hide");
  });

  var __clickFlag = true;
  $('.order-table li').click(function () {
    var list = [];
    $("select[name='trades_status_new']").find("option").each(function () {
      list.push($(this).val());
    });
    var currStatus = $(this).attr("data-status");
    if(__clickFlag && list.indexOf(currStatus) != -1){
      $("select[name='trades_status_new']").val(currStatus);
    }
    __clickFlag = true;
    tradesObj.newTradesStatus = currStatus;
    tradesObj.queryCountBtn=0;

    pagination_page_no=1;

    tradesObj.getTradesList();
  });

  $("select[name='trades_status_new']").change(function(){
    __clickFlag = false;

    var status = $(this).val();
    var count = 0;
    $('.order-table li').each(function(){
      if($(this).attr("data-status") == status){
        $(this).children().click();
        count ++;
      }
    });
    if(count == 0){
      $('.order-table li:eq(0)').children().click();
    }

  });


    $(".do-search").click(function () {
    // var store_name = $(".search-text").val();
    // param = {};
    // param.store_name = store_name;
    // tradesObj.doSearch(param);

    searchStores();

  });

  $("#serve_type").change(function () {

    $(".search-text").val("");

    if ($(this).val() == 130) {
      $("[name='save_all']").addClass('lee_hide');
      $("#hide_part").addClass('lee_hide');
      // $("#hide_part").html("");
    } else {
      param = {};
      param.service_support = $(this).val();
      tradesObj.doSearch(param);
      $("#hide_part").removeClass('lee_hide');
      $("[name='save_all']").removeClass('lee_hide');
    }
  });

  $(".send-confirm").live("click", function () {
    //订单类型
    var flag =$(this).parent().parent().eq(0).find("div[name=jd]")
    if(GroupPromotionsShippingConfirmation(flag)==false){
      return false
    }
    var tradesId = $(this).nextAll(".hidden-tradesId").val();
    $.post("/merchant/deliveryList", {}, function (res) {
      console.log("快递公司s");
      console.log(res);
      var tmpl = document.getElementById('company_select').innerHTML;
      var doTtmpl = doT.template(tmpl);
      $('[name="wcompany"]').html(doTtmpl(res.result));
      $.get("/merchant/selectTradesDetails?tradesId=" + tradesId, function (re) {
        console.log("selectTradesDetails");
        console.log(re);
        $(".deliver_info_name").text(re.value.recevierName + "," + re.value.recevierMobile);
        $(".deliver_info_addr").text(re.value.receiverCity + "," + re.value.receiverAddress);
        $('[name="wid"]').val(re.value.postNumber);
        $('[name="wcompany"] option[value="' + re.value.postId + '"]').attr("selected", "selected");
        $('[name="hidden-deliver-tradesid"]').val(tradesId);
        $("#deliver_dialog").modal("show");

      });
    });

  });


  $(".deliver_btn").click(function () {
    var tradesId = $('[name="hidden-deliver-tradesid"]').val();
    var post_name = $('[name="wcompany"] option:checked').text();
    var post_number = $('[name="wid"]').val();
    data = {};
    data.tradesId = tradesId;
    data.post_name = post_name;
    data.post_number = post_number;
    data.type = 3;
    $.post("/merchant/toDoorShipping", data, function (res) {
      console.log("确认发货");
      console.log(res);
      if (res.code == "000") {
        alert("确认发货成功");
        $("#deliver_dialog").modal("hide");
        location.reload();
      }
    });

  });

  $(".appoint-server-portal,[name='asigned_store_name']").live("click", function () {

    $(".search-text").val("");

    var tradesId = $(this).parents('table').find(".trades-id").attr("tradesid");
    $(".hidden-site-id").val(tradesId);
    var service_type_id = $(this).parents('table').find('[name="li_post_style"]').val();
    var trades_store_id = $(this).parents('table').find("[name='asigned_store_name']").attr("storeId");
    var trades_post_style = $(this).parents('table').find("[name='li_post_style']").attr("value");
    var create_order_assigned_stores = $(this).parents('table').find(".appoint-server-portal").attr("create_order_assigned_store");
    $("#dialog_trades_store_id").val(trades_store_id);
    $("#dialog_trades_post_style").val(trades_post_style);
    $("#dialog_trades_create_order_assigned_stores").val(create_order_assigned_stores);
    var param = {};
    param.service_support = service_type_id;
    tradesObj.doSearch(param);
    $("#serve_type option[value='" + service_type_id + "']").attr("selected", "selected");
    $("#cur_storename").html($(this).parents('table').find('[name="asigned_store_name"]').text());
    $("#store_select option:contains('" + $(this).parents('table').find('[name="asigned_store_name"]').text() + "')").attr("selected", "selected");

    $("#hide_part").removeClass('lee_hide');
    $("[name='save_all']").removeClass('lee_hide');

    $("#toStore_dialog").modal("show");
  });

  $('[name="save_all"]').click(function () {
    var data = {};
    data.assignedStores = $("#store_select option:selected").val();
    data.postStyle = $("#serve_type option:selected").val();
    data.tradesId = $(".hidden-site-id").val();
    if(!data.assignedStores){
      alert("您选择的服务门店和订单类型与原订单相同，无需操作哦！");
      return;
    }
    if(data.assignedStores == $("#dialog_trades_store_id").val() && data.postStyle == $("#dialog_trades_post_style").val()){
      alert("您选择的服务门店和订单类型与原订单相同，无需操作哦！");
      return;
    }
    $(this).attr("disabled", true);
    $.post("/merchant/assignStore", data, function (res) {
      $(this).removeAttr("disabled");
      if (res.code == "000") {
        alert("指定成功");
        $("#toStore_dialog").modal("hide");
        location.reload();
      }
    });
  });

  $(".comment-btn-flag").live("click", function () {
    var trade_id = $(this).parents("table").find(".trades-id").attr("tradesId");
    var getTradeDetailUrl = "/merchant/selectTradesDetails?tradesId=" + trade_id;
    $.get(getTradeDetailUrl, function (res) {
      if (res && res.value) {
        $('[name="dealer_remark"][value="' + res.value.sellerFlag + '"]').attr("checked", true);
        $('[name="seller_memo"]').val((res.value.sellerMemo!=null&&res.value.sellerMemo!="null"&&res.value.sellerMemo!="NULL")?res.value.sellerMemo:"");
      } else {
        $('[name="seller_memo"]').text("");
      }
    });
    $("#seller_memo").modal("show");
    $(".comment-btn-save").click(function () {
      tradesObj.saveComment(trade_id);
    });
  });

  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      tradesObj.getTradesList();
    }
  });

  //queryOrderCount();

});

//查询订单数量
function queryOrderCount(params){
  if(params.queryCountBtn==0)return;
  $.post("/merchant/tradesInfosCount", params, function (res) {
    if (res.code == "000") {
      //$("#order_nav").children("li").children("span").hide();
     $("#order_nav").children("li").each(function(n, obj){
       if (n == 0)return;
       var str = $(this).children("a").text();
       if(str.indexOf("(")!=-1){
         str = str.substr(0, str.indexOf("("));
         $(this).children("a").text(str);
       }
       if(res.value.countList[n]){
         var text = str + "(" + res.value.countList[n] + ")";
         $(this).children("a").text(text);
       }
       //$(this).append("<span class='num'>"+res.value.countList[n]+"</span>");
     });
    }
  });
}

var searchReport = function (flag) {
  if(tradesObj.totalTrades>2000){
    $(".export-report").html("根据本次查询条件，共查询到"+tradesObj.totalTrades+"条订单结果,已超过&nbsp;2000&nbsp;条订单的最大值，请修改查询条件，分批次下载。");
    $("#export_list").modal("show");
    return;
  }else if(tradesObj.totalTrades<=0){
    $(".export-report").html("根据本次查询条件，未查询到相关订单信息！");
    $("#export_list").modal("show");
    return;
  }

  $(".export-report").html("根据本次查询条件，共查询到" + tradesObj.totalTrades + "条订单结果,请<a id = 'do-export' style='cursor:pointer'>点击下载</a>。");

  $("#export_list").modal("show");

  $("#do-export").click(function () {
    tradesObj.exportReport(tradesObj.siteId, flag);
  });
  //TODO
  //$("#export_list").modal("hide");
};

/****后台数据调取api****/
var tradesObj = {


  tradesStatus: "",//订单状态
  postStyle: "",//订单类型
  tradesSource: "",//订单来源
  payStyle: "",//支付方式
  clerkInvitationCode: "",//邀请码
  orderTimeStart: "",//开始时间
  orderTimeEnd: "",//结束时间
  logisticsStatus: "",//配送装态'
  commentRank: "",//评分
  totalTrades: "",
  siteId: "",
  totalpage: 0,
  totalitem: 0,
  dataStatus: 0,
  paytime: 3,//下单后交易设置的付款时间
  storesId: '',
  getTradesList: function () {

    // var key = $('[name = "flag" ]').val();
    var mobile = $('#uid').val(); //会员
    var tradesId = $('[name = "order_num"]').val();  //订单号

    var goodsCode = $('[name = "goods_code"]').val();  //商品编码

    var postStyle = $('[name = "post_style"]').val();
    var payStyle = $('[name = "pay_style"]').val();
    var tradesSource = $('[name = "trades_source"]').val();
    var tradesStatusNew = $('[name = "trades_status_new"]').val();
    var clerkInvitationCode = $('[name = "clerk_invitation_code"]').val();

    var settlementStatus=$('[name = "settlement_status"]').val();

    var tradesStartTime = $('#trades_start_time').val();
    var tradesEndTime = $('#trades_end_time').val();

    var orderTimeStart = $('#start_time').val();
    var orderTimeEnd = $('#end_time').val();

    var logisticsStatus = $('[name = "logistics_status"]').val();
    var storesId = $('[name ="store_id"]').val();
    var commentRank = $('#trades_rank').val();


    var params = {};

    if (tradesObj.postStyle) params.postStyle = tradesObj.postStyle;
    else if (postStyle) params.postStyle = postStyle;
    if (payStyle) params.payStyle = payStyle;
    if (tradesSource) params.tradesSource = tradesSource;
    //if (tradesStatus || tradesObj.dataStatus) params.tradesStatus = tradesStatus ? tradesStatus + "," + tradesObj.dataStatus : tradesObj.dataStatus;
    if (tradesStatusNew) tradesObj.newTradesStatus = tradesStatusNew;
    if (clerkInvitationCode) params.clerkInvitationCode = clerkInvitationCode;
    if (orderTimeStart) params.orderTimeStart = orderTimeStart;
    if (orderTimeEnd) params.orderTimeEnd = orderTimeEnd;
    if (logisticsStatus) params.logisticsStatus = logisticsStatus;
    if (commentRank) params.commentRank = commentRank;
    if (storesId) params.storesId = storesId;
    if (settlementStatus) params.settlementStatus = settlementStatus;
    if (tradesStartTime) params.tradesStartTime = tradesStartTime+' 00:00:00';
    if (tradesEndTime) params.tradesEndTime = tradesEndTime+' 23:59:59';
    if (tradesId) params.tradesId = tradesId; //订单号
    if (mobile) params.mobile = mobile; //会员
    if (goodsCode) params.goodsCode = goodsCode;  //商品编码
    /*if (key == "订单号") {

     var tradesId = $('#uid').val();
     if (tradesId) params.tradesId = tradesId;

     } else {
     var mobile = $('#uid').val();
     if (mobile) params.mobile = mobile;


     }*/

    params.pageNum = pagination_page_no;
    params.pageSize = pagination_pagesize;


    if($("#assignId").length>0){
      params.assignFlag = 1;
    }

    $("#order_table").empty();
    AlertLoading($("#order_table"));
    var getTradesUrl = "/merchant/tradesInfos";
    console.log("params");
    console.log(params);
      params.platform = 2;//0-微信商城，1-pc商城，2-商户后台，3-门店后台，4-门店APP，
      params.type = 0;//0-列表，1-详情
    if (tradesObj.newTradesStatus) params.newTradesStatus = tradesObj.newTradesStatus;

    params.queryCountBtn = tradesObj.queryCountBtn;
    queryOrderCount(params);

    $.post(getTradesUrl, params, function (res) {
      console.log("res-list");
      console.log(res);

      if (null != res && null != res.value && null != res.value.tradesList) {
        pagination_pages = res.value.page.pages;
        pagination_totals = res.value.page.total;

        for (var m in res.value.tradesList) {
          var tradesButtonStr = "";
          if ((res.value.tradesList[m].pageShow)) {
            var buttons = res.value.tradesList[m].pageShow.buttons;
            for (var n in buttons) {
              tradesButtonStr += buttons[n].show + "_";
            }
          }else{
            res.value.tradesList[m].pageShow = {};
          }
          res.value.tradesList[m].pageShow.tradesButtonStr = tradesButtonStr;
        }

        var tmpl = document.getElementById('trades_list_templete').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $('#order_table').html(doTtmpl(res.value.tradesList));
        $('#order_table').append("<span class='pageinfo'></span>");
        tradesObj.totalTrades = res.value.page.total;
        tradesObj.siteId = res.value.tradesList[0].siteId;

        addpage(tradesObj.getTradesList);
      } else {
        tradesObj.totalTrades=0;
        $('#order_table').html("<p style='text-align:center'>暂无数据</p>");

      }

    });

  },
  exportReport: function (siteId, flag) {

    // var key = $('[name = "flag" ]').val();
    var mobile = $('#uid').val(); //会员
    var tradesId = $('[name = "order_num"]').val();  //订单号

    var postStyle = $('[name = "post_style"]').val();
    if(!postStyle){
      postStyle = tradesObj.postStyle;
    }
    var payStyle = $('[name = "pay_style"]').val();
    var tradesSource = $('[name = "trades_source"]').val();
    var tradesStatus = $('[name = "trades_status"]').val();
    var clerkInvitationCode = $('[name = "clerk_invitation_code"]').val();
    var orderTimeStart = $('#start_time').val();
    var storesId = $('#stores_opt').val();

    /*  orderTimeStart = Date.parse(new Date(orderTimeStart));
     orderTimeStart = orderTimeStart / 1000;
     console.log("orderTimeStart");
     console.log(orderTimeStart);*/
    var orderTimeEnd = $('#end_time').val();
    /* orderTimeEnd = orderTimeEnd / 1000;
     orderTimeEnd = Date.parse(new Date(orderTimeEnd));*/
    var logisticsStatus = $('[name = "logistics_status"]').val();
    var commentRank = $('#trades_rank').val();
    var settlementStatus = $('[name="settlement_status"]').val();
    var tradesStartTime = $('#trades_start_time').val();
    var tradesEndTime = $('#trades_end_time').val();
    var goodsCode = $('[name = "goods_code"]').val();  //商品编码
    var trades_status_new = $('[name = "trades_status_new"]').val();  //订单状态
    var trades_source=$('[name = "trades_source"]').val();  //下单方式

    var params = {};


    if (postStyle) params.postStyle = postStyle;
    if (payStyle) params.payStyle = payStyle;
    if (tradesSource) params.tradesSource = tradesSource;
    //if (tradesStatus || tradesObj.dataStatus) params.tradesStatus = tradesStatus ? tradesStatus + "," + tradesObj.dataStatus : tradesObj.dataStatus;
    if (clerkInvitationCode) params.clerkInvitationCode = clerkInvitationCode;
    if (orderTimeStart) params.orderTimeStart = orderTimeStart;
    if (orderTimeEnd) params.orderTimeEnd = orderTimeEnd;
    if (logisticsStatus) params.logisticsStatus = logisticsStatus;
    if (commentRank) params.commentRank = commentRank;
    if (storesId) params.storesId = storesId;
    if (tradesId) params.tradesId = tradesId; //订单号
    if (mobile) params.mobile = mobile; //会员
    if(settlementStatus) params.settlementStatus = settlementStatus;
    if (tradesStartTime) params.tradesStartTime = tradesStartTime+' 00:00:00';
    if (tradesEndTime) params.tradesEndTime = tradesEndTime+' 23:59:59';
    if (goodsCode) params.goodsCode = goodsCode;  //商品编码
      if (trades_status_new) params.newTradesStatus = trades_status_new;  //订单状态
      //if (trades_source) params.tradesSource = trades_source;  //下单方式

    /*if (key == "订单号") {

     var tradesId = $('#uid').val();
     if (tradesId) params.tradesId = tradesId;

     } else {
     var mobile = $('#uid').val();
     if (mobile) params.mobile = mobile;


     }*/

    //params.pageNum = tradesObj.pageno;
    //params.pageSize = tradesObj.pagesize;
    //var urlStr = tradesObj.parseParam(params);
    //console.log("The url is /trades/report?reportType=1&siteId="+siteId+"&"+urlStr);

    var form = $("<form>");//定义一个form表单
    form.attr("style", "display:none");
    form.attr("target", "");
    form.attr("method", "post");
    for (var i in params) {
      form.append('<input type="hidden" name="' + i + '" value="' + params[i] + '" >');
    }
    console.log(form.html());
    if (flag === 0) {
      form.attr("action", "/trades/goodsReport?reportType=2");
    } else {
      form.attr("action", "/trades/report?reportType=2");
    }
    $("body").append(form);//将表单放置在web中
    form.submit();//表单提交

  },
  cancelTrades: function (_this) {
    var tradesId = $(_this).parents(".trades-tbody").prev().find(".trades-id").attr("tradesId");
    $.get("/merchant/tradesClose?tradesId=" + tradesId, function (res) {
      console.log(res);
      if (res.code == "000") {
        alert("取消成功");
        location.reload();
      }
    });
  },
  // parseParam:function(param, key){
  //   var paramStr="";
  //   if(param instanceof String||param instanceof Number||param instanceof Boolean){
  //     paramStr+="&"+key+"="+encodeURIComponent(param);
  //   }else{
  //     $.each(param,function(i){
  //       var k=key==null?i:key+(param instanceof Array?"["+i+"]":"."+i);
  //       paramStr+='&'+tradesObj.parseParam(this, k);
  //     });
  //   }
  //   return paramStr.substr(1);
  // },

  doTinit: function () {
    //配置定界符
    doT.templateSettings = {
      evaluate: /\[\%([\s\S]+?)\%\]/g,
      interpolate: /\[\%=([\s\S]+?)\%\]/g,
      encode: /\[\%!([\s\S]+?)\%\]/g,
      use: /\[\%#([\s\S]+?)\%\]/g,
      define: /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
      conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
      iterate: /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
      varname: 'it',
      strip: true,
      append: true,
      selfcontained: false
    };
  },
  doSearch: function (param) {
    $.ajaxSettings.async = false;
    $.post("/common/selectStoreByServiceSupport", param, function (res) {
      console.log("查询");
      console.log(res);
      var tmpl = document.getElementById('stores_select').innerHTML;
      var doTtmpl = doT.template(tmpl);
      if (res.status == 1) {
        $('#store_select').html(doTtmpl(res.storelist));
      } else {
        $('#store_select').html("没有门店可供选择");
      }
    });
    $.ajaxSettings.async = true;
  },
  saveComment: function (tradesId) {
    var data = {};
    data.sellerFlag = $('[name="dealer_remark"]:checked').val();
    data.sellerMemo = $('[name="seller_memo"]').val();
    data.tradesId = tradesId;
    $.post("/merchant/merchantComment", data, function (res) {
      if (res && res.code == "000") {
        $("#seller_memo").modal("hide");
        alert("保存成功");
      } else {
        alert("保存失败");
      }
      location.reload();
    })
  },
  timeToDate: function (time) {
    var timestamp4 = new Date(time);
    return timestamp4.toLocaleDateString().replace(/\//g, "-") + " " + timestamp4.toTimeString().substr(0, 8);
  },
  counter: function (t) {

    var date = new Date();

    var year = date.getFullYear();

    var date2 = new Date(t + 24 * tradesObj.paytime * 3600000);
    /*转换成秒*/
    var time = (date2 - date) / 1000;
    var day = Math.floor(time / (24 * 60 * 60))


    var hour = Math.floor(time % (24 * 60 * 60) / (60 * 60))

    var minute = Math.floor(time % (24 * 60 * 60) % (60 * 60) / 60);

    var second = Math.floor(time % (24 * 60 * 60) % (60 * 60) % 60);

    var str = day + "天" + hour + "时" + minute + "分后自动取消订单";
    return str;
  },
  receiveConfirm: function (_this) {
    var tradesId = $(_this).parents(".trades-tbody").prev().find(".trades-id").attr("tradesId");
    $.get("/merchant/confirmReceive?tradesId=" + tradesId + "&tradesStatus=220", function (res) {
      if (res && res.code == "000") {
        alert("确认收货成功");
        location.reload();
      }
    });
  },

  //查询下单后交易设置的付款时间
  getPaytime: function () {
    var siteId = $(".hidden-site-id").val();
    if (!siteId) {
      //alert("获取siteId失败");
      return;
    }

    $.ajax({
      type: "POST",
      url: "../jk51b/settlement/parameter/getdealtime?site_id=" + siteId,
      success: function (date) {
        if (date.dealTimeParam) {
          tradesObj.paytime = date.dealTimeParam.trades_auto_close_time;
        } else {
          //alert("查询下单后交易设置的付款时间失败");
        }
      }
    });
  },

 /* getGroupInfo :function () {
    doGetOrPostOrJson()
  }*/


};

function searchStores(){
  var storeName = $(".search-text").val().replace(/\s/g, "");
  $("#store_select").children().hide().each(function(){
    if($(this).text().replace(/\s/g, "").indexOf(storeName) != -1){
      $(this).show();
    }
  });
}



function selectPermission(trades_id,real_pay) {
  $.ajax({
    type: "get",
    url: "/merchant/isupdatePrice",
    success: function (date) {
      if (date) {
        $("#updateTradesPrice").modal('show');
        $("#oldPrice").text((real_pay/100).toFixed(2));
        $("#trades_iddd").val(trades_id);
      }else {
        $("#role").modal('show');
      }
    }
  });
}

function updatePriceOk() {
  var kk={};
  kk.tradesId=$("#trades_iddd").val(),
  kk.price=$("input[name=updatePrice]").val(),

  kk.remark=$("textarea[name=updateRemark]").val()
  if( kk.price==""||kk.price==null){
    return layer.msg("修改价格不能为空");
  }
    $.ajax({
      type: "get",
      url:"/merchant/upTradesPrice",
      data:kk,
      success: function(data){
        var flag=true;
        if (data){
          layer.msg("修改成功");
          setTimeout("window.location.reload()",1500);
        }else if(flag==true){
          return layer.msg("防止重复提交");
        }
        else {
          return  layer.msg("修改失败");
        }
      },
    });
}

function GroupPromotionsShippingConfirmation ($icon) {
  if($icon) {
    var servceType = $icon.find("input[name=servceTpye]").val();
    var groupStatus =$icon.find("input[name=groupStatus]").val()
    if (servceType == 50) {
      if (groupStatus == 1) {
        layer.msg("该订单正在拼团中，暂时还不能发货，需要完成拼团后才能发货哦！")
        return false
      } else if (groupStatus == 4) {
        layer.msg("该拼团已经取消，正在退款中，无需发货！")
        return false
      } else if (groupStatus ==3) {
        layer.msg("拼团失败！不可发货")
        return false
      } else if (groupStatus ==0) {
        layer.msg("参团失败！")
        return false
      } else {

      }
    }
  }
}








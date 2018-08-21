
$(function () {

  $("#btn_"+getUrlParam("postStyle")).show();

  select("N");

  function showUp() {

  $('#myModa2').modal('show');
  }

  $(document).on('change', '.page_size_select',function () {
    pageSize = $(this).val();
    select("N");
  });

  $.ajax({
    url: '/store/order/selectTradesPostStyleCount',
    type: 'GET',
    success: function (res) {
      if (res.code == "000") {
        $("#nav_post_style").children(".right_nav-li").each(function(n, obj){
          if(res.value.countList[n]){
            $("#nav_" + n).html(res.value.countList[n]).css({'display': res.value.countList[n] <= 0 ? 'none' : 'block'});
          }
        });
      }
    },
    error:function(){
      console.log("error ....");
    }
  });

  //selectTradesCount();
  var __clickFlag = true;
  $('#order_nav').children("li").click(function () {
    var list = [];
    $("#tradesStatusNew").find("option").each(function () {
      list.push($(this).val());
    });
    var currStatus = $(this).attr("data-status");
    if(__clickFlag && list.indexOf(currStatus) != -1){
      $("#tradesStatusNew").val(currStatus);
    }
    __clickFlag = true;

    newTradesStatus = $(this).attr("data-status");
    _queryCountBtn =1;
    currentPage = 1;
    select("N");
  });


  $('#tradesStatusNew').change(function(){
    __clickFlag = false;

    var status = $(this).val();
    var count = 0;
    $('#order_nav').children("li").each(function(){
      if($(this).attr("data-status") == status){
        $(this).children().click();
        count ++;
      }
    });
    if(count == 0){
      $('#order_nav li:eq(0)').children().click();
    }

  });

  var post = getUrlParam("index")||0;
  $("#nav_"+post).parent().parent().addClass("order-active");
});

var _queryCountBtn;

function selectTradesCount(data){

  if(_queryCountBtn==1)return;
  $.ajax({
    url: '/store/order/selectTradesCount',
    type: 'POST',
    data: data,
    success: function (res) {
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
    },
    error:function(){
      console.log("error ....");
    }
  });
}

var currentPage = 1;
var pageSize = 15;
var total_items = 0;
var total_page = 0;
var newTradesStatus;
/*$(".page_size_select").change(function () {
  pageSize = $(this).val();
  select("N");
});*/
function select(status) {
  if(status=="N"){
    currentPage = 1;
  }

  /*var tradesId = "";
  if($("#tradesId").val()!=undefined){
    tradesId = $("#tradesId").val();
  }
  var mobile = "";
  if($("#phone").val()!=undefined){
    mobile = $("#phone").val();
  }*/

  var tradesId = "";
  var mobile = "";
  if($("#selectType").val()=="tradesId"){
    tradesId = $("#text").val();
  }else if($("#selectType").val()=="phone"){
    mobile = $("#text").val();
  }

  var tradesStatus = "";
  if($("#tradesStatusNew").val()!=undefined){
    tradesStatus = $("#tradesStatusNew").val();
  }
  var postStyle = "";
  if (getUrlParam("postStyle") != 1) {
    postStyle = getUrlParam("postStyle");
  }
  if($("#postStyle").val()){
    postStyle = $("#postStyle").val();
  }
  var logisticsStatus = "";
  if($("#logisticsStatus").val()!=undefined){
    logisticsStatus = $("#logisticsStatus").val();
  }
  var clerkInvitationCode = "";
  if($("#clerkInvitationCode").val()!=undefined){
    clerkInvitationCode = $("#clerkInvitationCode").val();
  }
  var orderTimeStart = "";
  if($("#start_time").val()!=undefined){
    orderTimeStart = $("#start_time").val();
  }
  var orderTimeEnd = "";
  if($("#end_time").val()!=undefined){
    orderTimeEnd = $("#end_time").val();
  }
  var commentRank = "";
  if($("#commentRank").val()!=undefined){
    commentRank = $("#commentRank").val();
  }
  var payStyle = "";
  if($("#payStyle").val()!=undefined){
    payStyle = $("#payStyle").val();
  }
  var tradesSource = "";
  if($("#tradesSource").val()!=undefined){
    tradesSource = $("#tradesSource").val();
  }

  newTradesStatus = tradesStatus;
  var data={
    "tradesId":tradesId,
    "mobile":mobile,
    //"tradesStatus":tradesStatus,
    "postStyle":postStyle,
    "logisticsStatus":logisticsStatus,
    "clerkInvitationCode":clerkInvitationCode,
    "orderTimeStart":orderTimeStart,
    "orderTimeEnd":orderTimeEnd,
    "commentRank":commentRank,
    "payStyle":payStyle,
    "tradesSource":tradesSource,
    "pageNum":currentPage,
    "pageSize":pageSize,
    "newTradesStatus":newTradesStatus
  };

  if(location.href.indexOf("/store/order/index_assign")>0){
    data.assignStoreFlag=1;
    data.assignFlag=1;
  }

  //$("#order_list").html("");
  // $(".sui-text-right").html("");

  $("#pageinfo").empty();
  $("#order_list").empty();
  AlertLoading($("#order_list"));

  selectTradesCount(data);

  $.ajax({
    type:'post',
    url:'./selectTrades',
    data:data,
    dataType: 'json',
    success: function(data){
      $("#order_list").html("");

      for (var m in data.value.tradesList) {
        var tradesButtonStr = "";
        if (data.value.tradesList[m].pageShow) {
          var buttons = data.value.tradesList[m].pageShow.buttons;
          for (var n in buttons) {
            tradesButtonStr += buttons[n].show + "_";
          }
        }else {
          data.value.tradesList[m].pageShow = {};
        }
        data.value.tradesList[m].pageShow.tradesButtonStr = tradesButtonStr;
      }

      var tmpl=document.getElementById('index_list').innerHTML;
      var doTtmpl=doT.template(tmpl);
      console.log(doTtmpl);
      $("#order_list").append(doTtmpl(data));

      $('.pageinfo').find('span:contains(共)').empty();
      $("#pageinfo").empty();
      total_items = data.value.page.total;
      total_page = data.value.page.pages;
      if(total_items!=0){
        $("#pageinfo").append('<span class ="pageinfo" style=""></span>' );
      }
      $('.pageinfo').pagination({
        pages: total_page,
        styleClass: ['pagination-large'],
        showCtrl: true,
        displayPage: 6,
        currentPage: currentPage,
        onSelect: function (num) {
          currentPage = num;
          select();
          getNum();
        }
      });
      /*if(status=="N"){
       getNum();
       }*/getNum();
      $('.select_all_btn').attr("checked", false);
      $('.select_all_btn').parent().removeClass("checked");
    },
    error:function(){
      console.log("error ....");
    }
  });
}
function getNum(){
  $('.pageinfo').find('span:contains(共)').append("(" + total_items + "条记录)");
  //页码选择
  var pagearr = [15,30,50,100];
  var pageselect = '&nbsp;<select class="page_size_select" style="width:53px">';
  $.each(pagearr, function(){
    if(this==pageSize) {
      pageselect =pageselect+'<option value="'+this+'" selected>'+this+'</option>';
    }else{
      pageselect =pageselect+'<option value="'+this+'" >'+this+'</option>';
    }
  });
  pageselect = pageselect+'</select>&nbsp;';
  $('.pageinfo').find('span:contains(共)').prepend(pageselect);
}

  /*function page(){
    select(2);
  }*/
  function todoor_stocking(tradesId, tradesStatus, stockupStatus, shippingStatus) {
    alert(tradesId + "，" + tradesStatus + "，" + stockupStatus + "，" + shippingStatus);
    $.ajax({
      url: 'storeTrades/todoor',
      type: 'POST',
      data: {
        "tradesId": tradesId,
        "tradesStatus": tradesStatus,
        "stockupStatus": stockupStatus,
        "shippingStatus": shippingStatus
      },
      success: function (data) {
        alert(data);
      }
    });
  }
function selectTradesStatus(val) {
    $("#trades_status").find("option[value='"+val+"']").attr("selected",true);
    $("#trades_status").find("option[value='"+val+"']").siblings().removeAttr("selected");
    select("N");
}

function formatDate(date, format) {
  /*
   * 使用例子:format="yyyy-MM-dd hh:mm:ss";
   */
  var o = {
    "M+" : date.getMonth() + 1, // month
    "d+" : date.getDate(), // day
    "h+" : date.getHours(), // hour
    "m+" : date.getMinutes(), // minute
    "s+" : date.getSeconds(), // second
    "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
    "S" : date.getMilliseconds()
    // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
      - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

function checkedGroup (e) {
  var flag =$(e).parent().parent().parent().parent().eq(0).find("div[name=jd]")
  if(GroupPromotionsShippingConfirmation(flag)==false){
    return false
  } else
    return true
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

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]); return null;
}



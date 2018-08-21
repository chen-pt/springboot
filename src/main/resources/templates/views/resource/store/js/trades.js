
$(function () {
  select("N");

  function showUp() {

    $('#myModa2').modal('show');
  }

  $(document).on('change', '.page_size_select',function () {
    pageSize = $(this).val();
    select("N");
  });

  $.ajax({
    url: '/store/orderCount',
    type: 'GET',
    success: function (data) {

      $("#allCount").html(data.allCount).css({'display':data.allCount <=0?'none':'block'});
      $("#beihuoCount").html(data.beihuoCount).css({'display':data.beihuoCount <=0?'none':'block'});
      $("#fahuoCount").html(data.fahuoCount).css({'display':data.fahuoCount <=0?'none':'block'});
      $("#zitiCount").html(data.zitiCount).css({'display':data.zitiCount<=0?'none':'block'});
      $("#zhigouCount").html(data.zhigouCount).css({'display':data.zhigouCount <=0?'none':'block'});
    },
    error:function(){
      console.log("error ....");
    }
  });

});
var currentPage = 1;
var pageSize = 15;
var total_items = 0;
var total_page = 0;
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
  if($("#tradesStatus").val()!=undefined){
    tradesStatus = $("#tradesStatus").val();
  }
  var postStyle = "";
  if($("#postStyle").val()!=undefined){
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

  //全部：""; 备货："beihuo"; 发货："fahuo"; 自提："ziti"; 直购订单确认："zhigou";
  var tradesFlag = "";
  if($("#tradesFlag").val()!=undefined){
    tradesFlag = $("#tradesFlag").val();
  }

  var data={
    "tradesId":tradesId,
    "mobile":mobile,
    "tradesStatus":tradesStatus,
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
    "tradesFlag":tradesFlag
  };

  if(location.href.indexOf("/store/order/index_assign")>0){
    data.assignStoreFlag=1;
    data.assignFlag=1;
  }

  //$("#order_list").html("");
  // $(".sui-text-right").html("");
  AlertLoading($("#order_list"));
  $.ajax({
    type:'post',
    url:'./selectTrades',
    data:data,
    dataType: 'json',
    success: function(data){
      $("#order_list").html("");

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





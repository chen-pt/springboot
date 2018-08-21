var itemsCount;
var reward_id;
var distributorId;

$(document).ready(function(){

  $("title").html("推荐人订单奖励");

  getMoney();
  getRewardList();

  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      getRewardList();
    }
  });

})

/**
 * 推荐订单列表
 */
function getRewardList() {

  var datas = {};
  datas.page = pagination_page_no;
  datas.pageSize = pagination_pagesize;
  datas.distributor = $("input[name='distributor']").val();
  datas.order_id = $("input[name = 'order_id']").val();
  datas.reward_status = $('#reward_status option:selected').val() == 3 ? null : $('#reward_status option:selected') .val();
  datas.order_status = $('#order_status option:selected').val() == 3 ? null : $('#order_status option:selected').val();
  datas.start_time = $("input[name = start_time]").val();
  datas.end_time = $("input[name = end_time]").val();

  $("#vip_table").html('');
  AlertLoading($("#vip_table"));

  $.ajax({
    type: 'POST',
    url: "/merchant/recommend/rewardlist",
    data:datas,
    dataType: 'json',
    success: function(data){
      $("#rewardList").html('');
      var tmpData = data;

      pagination_pages = tmpData.total_pages;
      pagination_totals = tmpData.total_items;
      itemsCount = tmpData.total_items;

      if(tmpData.items.length){
        var tmpHtml = "";
        for (var i=0;i<tmpData.items.length;i++){
          var reward=tmpData.items[i];
          var id = reward.id==null? "---":reward.id;
          var orderId=(reward.orderId==null)? "---":reward.orderId;
          var realPay =( reward.realPay == null)? "---" : reward.realPay;
          var levelAward1 = (reward.levelAward1 == null) ? "---" : reward.levelAward1;
          var levelAward2 = (reward.levelAward2 == null)? "---" : reward.levelAward2;
          var levelAward3 = reward.levelAward3 == null ? "---" : reward.levelAward3;
          var totalAward = reward.totalAward == null ? "0" : reward.totalAward;
          var createTime = (reward.createTime == null || reward.createTime==57599000) ? '0000-00-00 00:00:00': (new Date(parseFloat(reward.createTime))).format("yyyy-MM-dd hh:mm:ss");
          var orderStauts;
          var rewardStatus;
          var idHtml= "<td >"+id+"</td>";
          if(reward.orderStauts == 0){
            //orderStauts = "交易失败（退款）";
            orderStauts = "<td style='color: #e04c2d'>交易失败（退款）</td>";

            rewardStatus = "<span style='color: #888888' >无奖励</span>";

          }else if(reward.orderStauts == 1){
            //orderStauts = "交易成功";

            orderStauts = "<td style='color: #00A000'>交易成功</td>";

            rewardStatus = "<span style='color: #888888' >待确认</span>";



          }else if (reward.orderStauts == 2){
            //orderStauts = "交易结束";
            orderStauts = "<td style='color: #30b08f'>交易结束</td>";
            idHtml="<td >"+"<input type='checkbox' name='rid' id='"+id+"'   value='" + id + "'>"+id+"</td>";

            if (reward.rewardStatus ==0){
              rewardStatus = "<a name='rewardStatus' href='#' onclick='recordRewardId("+ id+","+ reward.distributor_id +")'data-toggle='modal' data-target='#myModal' data-keyboard='false' >待处理</a>";
            }else if (reward.rewardStatus == 1){
              rewardStatus = "<span style='color: #888888' >已确认奖励</span>";
            }

          }else if (reward.orderStauts == 110){
            orderStauts = "<td style='color: #e04c2d'>未付款</td>";
            rewardStatus = "<span style='color: #888888' >无奖励</span>";
          }
          tmpHtml +="<tr>" +
             idHtml+
            "<td>"+orderId+"</td>" +
            "<td>"+realPay+"</td>" +
            "<td>"+levelAward1+"</td>" +
            "<td>"+levelAward2+"</td>" +
            "<td>"+levelAward3+"</td>" +
            "<td>"+totalAward+"</td>" +
            "<td>"+createTime+"</td>" +
            orderStauts+
            "<td>" + rewardStatus +"</td>"+
            "</tr>";
        }

        $("#rewardList").html(tmpHtml);
        $("#rewardList").append('<tr><td colspan="10"><span class ="pageinfo"></span></td></tr>' );

        addpage(getRewardList);

        $('.select_all_btn').attr("checked", false);
        $('.select_all_btn').parent().removeClass("checked");
      }else{

        $("#rewardList").append("<tr><td colspan='10' height='30' style='text-align: center'>暂无数据</td></tr>");
      }
      getMoney(datas);
    },
    error:function(){
      console.log("error ....");
    }
  });
}

/**
 * 已确认、待确认金额
 */

function getMoney(datas) {
  $.ajax({
    type: 'POST',
    url: "/merchant/recommend/totalReward",
    data:datas,
    dataType: 'json',
    success: function(data) {
      var receviedMoney = data.receviedMoney / 100;
      var payMoney = data.payMoney / 100;
      $("#recevied_money").html(receviedMoney.toFixed(2));
      $("#pay_money").html(payMoney.toFixed(2));
    },
    error:function(){
      console.log("error ....");
    }
  });
}

function recordRewardId(id,distributor_id) {

  distributorId = distributor_id;
  reward_id = id;

}
/**
 * 确认订单奖励
 */
function confirmOrderReward() {

  // var rewardStatus = $("input[name='reward_status_c']:checked").val();

  var rewardStatus = 1;
  $.post(
    "/merchant/recommend/confirmOrderRewardStatus",{
      id : reward_id,
      distributorId : distributorId,
      rewardStatus : rewardStatus
    },function (result) {
      reward_id = null;
      $("input[name='reward_status_c']").removeAttr("checked");
      if(result.status == 200 && result.data == 1){
        layer.msg("确认成功！");
        getRewardList();
      }else if(result.status == 200 && result.data == 2){
        layer.msg("系统通信异常（2），状态重复，请刷新重试，或联系客服");
      }else if(result.status == 200 && result.data == 3){
        layer.msg("系统通信异常（3），状态规则不符，请刷新重试，或联系客服！");
      }else if(result.status == 200 && result.data == 4){
        layer.msg("系统通信异常（4），订单奖励信息异常，请刷新重试，或联系客服！");
      }else {
        layer.msg(result.msg);
      }
    });
  
}

$(".confirm_batch_btn").click(function () {
  var ids = new Array();
  $('input[name="rid"]:checked').each(function () {
    ids.push($(this).val());
  });
  ids = ids.join(',');
  if (ids.length > 0) {
    var rewardStatus = 1;
    $.post(
      "/merchant/recommend/batchConfirmOrderRewardStatus",{
        ids : ids,
        rewardStatus : rewardStatus
      },function (result) {
        console.log(result);
        if(result.status == 200 && result.data >0){
          layer.msg("确认成功！");
          getRewardList();
        }else if(result.status == 200 && result.data == 2){
          layer.msg("系统通信异常（2），状态重复，请刷新重试，或联系客服");
        }else if(result.status == 200 && result.data == 3){
          layer.msg("系统通信异常（3），状态规则不符，请刷新重试，或联系客服！");
        }else if(result.status == 200 && result.data == 4){
          layer.msg("系统通信异常（4），订单奖励信息异常，请刷新重试，或联系客服！");
        }else {
          layer.msg(result.msg);
        }
      });
  } else {
    alert("请选择待处理奖励！");
  }

});








/**
 * 日期格式化
 * @param format
 * @returns {*}
 */
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    // month
    "d+": this.getDate(),
    // day
    "h+": this.getHours(),
    // hour
    "m+": this.getMinutes(),
    // minute
    "s+": this.getSeconds(),
    // second
    "q+": Math.floor((this.getMonth() + 3) / 3),
    // quarter
    "S": this.getMilliseconds()
    // millisecond
  };
  if (/(y+)/.test(format) || /(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

/**
 * 门店列表
 */
function getStoreList() {

  $.post(
    "/merchant/storeName"
    ,function (data) {
      $(data).each(function(){
        ArrNameList.push(this.name);
      });
    });


}



/**
 * Created by admin on 2017/3/24.
 */

//更新商家备注
function sellerBtn() {
  var data ={};
  data.sellerFlag = $('[name="seller_flag"]:checked').val();
  data.sellerMemo = $("#seller_memo").val();
  data.tradesId = $("#tradesId").val();
    $.ajax({
      type:'post',
      url:'./updateSellerMemo',
      data:data,
      dataType: 'json',
      success: function(data){
        if(data && data.code == "000"){
          alert("更新成功");
          window.location.href="/store/order/index";
        }
      },
      error:function(){
        console.log("error ....");
      }
    });
}

//商品批号 同 trades_detail.js
var data = {};
$(".update_goods_batch_no").click(function () {
  data = {};
  $('[name="order_batch_no"]').val("");
  data.goodsId = $(this).next('[name="hidden_good_id"]').val();
  data.orderId = $("#tradesId").val();
  $.post("./getGoodsBatchsNo",data,function (res) {
    console.log("批号");
    console.log(res);
    if(res && res.code == 200){
      if(res.data.goodsBatchNo!=null && res.data.goodsBatchNo!="null" && res.data.goodsBatchNo!="NULL"){
        $('[name="order_batch_no"]').val(res.data.goodsBatchNo);
      }
    }
    $("#updateGoodsBatchNo").modal("show");
  });
});
$(".save_goods_batch_no").click(function () {
  var data2 = {};
  data2.goodsId = data.goodsId;
  data2.orderId = data.orderId;
  data2.goodsBatchNo  =$('[name="order_batch_no"]').val();
  $.post("./updateGoodsBatchsNo",data2,function (res) {
    if(res.code == 200){
      alert("操作成功");
      $("#updateGoodsBatchNo").modal("hide");
    }
  });
});

$(function () {
  $("#seller_memo_num").html($("#seller_memo").val().length);
});
$("#seller_memo").keyup(function(){
  $("#seller_memo_num").html($("#seller_memo").val().length);
});


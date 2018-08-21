
$(function(){

  $("title").html("提现设置");

  getWithdrawMinMoney();

})

/**
 * 提现最小金额回显
 */
function getWithdrawMinMoney() {

  $.post( "/merchant/recommend/getWithdrawMinMoney",{

    } ,function (result) {

      if(result.code == 1 || result.code == "1" || result.code == "success"){
        $("#min_reference_money").val((result.data / 100).toFixed(2));
      }else {
        alert("提现额度获取失败，请刷新重试或联系客服");
      }

    });
}

/**
 * 修改最小金额
 */
function setWithdrawMinMoney() {

  var minMoney = $("#min_reference_money").val();

  var reg = /^\d+(?=\.{0,1}\d+$|$)/;
  if(!reg.test(minMoney)){
    alert("请输入正数");
    return;
  }
  if(minMoney > 99999  ){
    alert("最高限度为 99999");
    return
  }

  if(minMoney) {

  }else {
    alert("提现额度不能为空！");
    return;
  }

  minMoney = parseInt(parseFloat(minMoney) * 100);

  if(minMoney <= 0){
    alert("提现额度要大于0！");
    return;
  }

  $.post(
    "/merchant/recommend/setWithdrawMinMoney",
    {
      minMoney:minMoney
    }
    ,function (result) {

      if(result.data || result.data > 0 ){
        alert("提现额度修改成功");
      }else {
        alert("提现额度修改失败");
      }

    });
}

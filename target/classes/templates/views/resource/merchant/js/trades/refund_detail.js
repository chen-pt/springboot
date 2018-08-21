$(document).ready(function () {
  var param = location.search;
  param = param.substr(param.lastIndexOf('=')+1);
  refundDetail(param);
});

var refundObj = {};

function refundDetail(tradesId) {
  $.ajax({
    type: 'post',
    url: '/merchant/selectRefundInfo',
    data: {"tradesId":tradesId},
    dataType: 'json',
    success: function (data) {
      console.log(data);
     // $(".page-content").append(doTtmpl(data));
      data.list=null;
      if(data.value!=null){
        data.value.createTime=format(data.value.createTime);
        if(data.value.voucher!=null){
         // var img=data.value.voucher.substr(0,data.value.voucher.length);
          var str=data.value.voucher.split(',https:');
          data.list=str;
        }
        refundObj.applyRefundMoney = data.value.realPay/100.00;
        var tmpl=document.getElementById('refundDetail').innerHTML;
        var doTtmpl=doT.template(tmpl);
        console.log(doTtmpl);
        $(".page-content").append(doTtmpl(data));
        $("#refund_cash").keyup(function () {
          var value = $(this).val();
          value = value.replace(/[^\d^\.]/g,'');
          value = value>refundObj.applyRefundMoney?refundObj.applyRefundMoney:value;
          var strArr = new String(value).split('.');
          var newStr='';
          for(var i in strArr){
            newStr+=strArr[i];
            if(i==0){
              newStr+='.';
            }
          }
          value=strArr.length>2?newStr:value;
          $(this).val(value);
        });
      }

    },
    error: function () {
      console.log("error ....");
    }
  });
}



function format(shijianchuo) {
  var time = new Date(shijianchuo);
  var y = time.getFullYear();
  var m = time.getMonth() + 1;
  var d = time.getDate();
  var h = time.getHours();
  var mm = time.getMinutes();
  var s = time.getSeconds();
  return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
};
function add0(m) {
  return m < 10 ? '0' + m : m
}

function dealRefund(is_refund) {
  var data={
    "is_integral":$("[name='is_integral']").val(),
    "is_coupon":$("input[type='radio']:checked").val(),
    "money":Math.round($("[name='money']").val()*10*10),
    "tradesId":$("[name='tradesId']").val(),
    "is_refund":is_refund,//$("[name='is_refund']").val()
  };
  $.ajax({
    type: 'post',
    url: '/merchant/merchantDealRefund',
    data: data,
    dataType: 'json',
    success: function (data) {
      console.log(data);
      // $(".page-content").append(doTtmpl(data));
      if(data.code=="000"){
        alert("操作成功");
        var backToPage = location.search.indexOf("backToPage=refund_list") != -1 ? "backToPage=refund_list" : "";
        location.href = "/merchant/refund_status?" + backToPage + "&tradesId=" + data.value;
      }else{
        alert("操作失败");
      }
    },
    error: function () {
      console.log("error ....");
    }
  });
}

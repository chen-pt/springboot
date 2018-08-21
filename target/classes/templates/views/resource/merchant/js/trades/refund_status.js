$(document).ready(function(){
  tradesObj.doTinit();

  var param = location.search;
  console.log("param");
  console.log(param);
  param = param.substr(param.lastIndexOf('=')+1);
  tradesObj.getRefundStatus(param);

});

/****后台数据调取api****/
var tradesObj = {

  getRefundStatus:function(trade_id){

    console.log(trade_id);
    var getTradeDetailUrl = "/merchant/selectRefundInfo?tradesId="+trade_id;
    $.get(getTradeDetailUrl,function (res) {
      console.log("res");
      console.log(res);
      if(res.code == "101"){
        $("#refund_status").html("未发现此退款信息");
      }
      if(res && res.value){
        $('.trades-id').text(res.value.tradeId).attr("href","orderDetail?tradesId="+res.value.tradeId);
        if(res.value.status == 100){
          $('.refund-status').text("申请退款");
        }else if(res.value.status == 110){
          $('.refund-status').text("拒绝退款");
        }else if(res.value.status == 120){
          $('.refund-status').text("退款成功");
        }else{
          $('.refund-status').text("");
        }
        $('.real-pay').text(parseFloat(res.value.realPay/100.0).toFixed(2)+"元");
        if(res.value.payStyle == 'ali'){
          $('.pay-style').text("支付宝");
        }else if(res.value.payStyle == 'wx'){
          $('.pay-style').text("微信");
        }else if(res.value.payStyle == 'health_insurance'){
          $('.pay-style').text("医保");
        }else if(res.value.payStyle == 'cash'){
          $('.pay-style').text("现金");
        }else if(res.value.payStyle == 'bill'){
          $('.pay-style').text("快钱");
        }else{
          $('.pay-style').text("");
        }

        $(".post-fee").text(parseFloat(res.value.freight/100.0).toFixed(2)+"元");
        $('.apply-refund').text(parseFloat(res.value.applyRefundMoney/100.0).toFixed(2)+"元");
        if(res.value.isRefundGoods == 0){
          $('.is-refund').text("不需要退货");
        }else if(res.value.isRefundGoods == 1){
          $('.is-refund').text("需要退货");
        }else{
          $('.is-refund').text("");
        }
        $(".post-num").text(res.value.refundExpressNo);
        $(".refund-reason").text(res.value.reason);
        $(".refund-explain").text(res.value.explain);
        //遍历图片

        console.log("res.value.voucher");
        console.log(res.value.voucher);
        res.value.voucher = new String(res.value.voucher).trim();
        if(null == res.value.voucher || "" == res.value.voucher){
          $("#refund_voucher").addClass("lee_hide");
        }else{
          var urls = [];
          urls = res.value.voucher.split(",https:");
          console.log("urls");
          console.log(urls);
          for(var i = 0;i<urls.length;i++){
            $("#refund_voucher").removeClass("lee_hide");
            // var html ='<a href="'+urls[i].replace(/\d+x\d+/, '600x600')+'" target="_blank"><img style="max-width:100px;max-height:100px;margin:3px;" src="'+urls[i]+'"></a>';
            var html ="<img data-toggle='modal' data-target='#BigImg' data-keyboard='false' onclick='showHref("+i+")' class='imgSrc' style='height: 150px;width: 120px;margin: 4px' src=\'"+urls[i] +"\'>";
            $(".product_img").append(html);
          }
        }


        if(res.value.payStyle == 'healthInsurance'&&res.value.payStyle == 'cash'){
          $(".agree-refund").text((parseFloat(res.value.refundCash/100.0).toFixed(2)+"元&nbsp;&nbsp")(parseFloat(res.value.refundHealthInsurance/100.0).toFixed(2)+"元"))
        }else{
          $(".agree-refund").text(parseFloat(res.value.realRefundMoney/100.0).toFixed(2)+"元");
        }
        //积分--未处理
        $("#integralUsed").text(res.value.integralUsed+"积分");
        if(res.value.isRefundIntegral == 0){
          $("#is_integral").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未退还");
        }else if(res.value.isRefundIntegral == 1){
          $("#is_integral").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已退还");
        }
        if(res.value.map.length<1){
          $("couponName").addClass("lee_hide");
          $("is_coupon").addClass("lee_hide");
        }
        if(res.value.map != null && res.value.map.orderUse != null){
          $("#couponName").text(res.value.map.orderUse.marked_words);
          if(res.value.isRefundCoupon == 0){
            $("#is_coupon").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未退还");
          }else if(res.value.isRefundCoupon == 1){
            $("#is_coupon").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;已退还");
          }
        } else {
          $("#couponName").text("未使用优惠券");
          $("#is_coupon").html("&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
        }
        // var date = new Date(res.value.createTime);
        // Y = date.getFullYear() + '-';
        // M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        // D = date.getDate() + ' ';
        // h = date.getHours() + ':';
        // m = date.getMinutes() + ':';
        // s = date.getSeconds();
        // $(".apply-time").text(Y+M+D+h+m+s);

        $(".apply-time").text(dataFormat(new Date(res.value.createTime),"yyyy-MM-dd hh:mm:ss"));
      }



    });

  },
  doTinit:function()
  {
    //配置定界符
    doT.templateSettings = {
      evaluate:    /\[\%([\s\S]+?)\%\]/g,
      interpolate: /\[\%=([\s\S]+?)\%\]/g,
      encode:      /\[\%!([\s\S]+?)\%\]/g,
      use:         /\[\%#([\s\S]+?)\%\]/g,
      define:      /\[\%##\s*([\w\.$]+)\s*(\:|=)([\s\S]+?)#\%\]/g,
      conditional: /\[\%\?(\?)?\s*([\s\S]*?)\s*\%\]/g,
      iterate:     /\[\%~\s*(?:\%\]|([\s\S]+?)\s*\:\s*([\w$]+)\s*(?:\:\s*([\w$]+))?\s*\%\])/g,
      varname: 'it',
      strip: true,
      append: true,
      selfcontained: false
    };
  }
};
Date.prototype.toLocaleString = function () {
  return this.getFullYear() + "." + (this.getMonth() + 1) + "." + this.getDate() + " " + this.getHours() + ":" + this.getMinutes() + ":" + this.getSeconds();
};

function  dataFormat (date, fmt){
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    "S": date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

var flags = true;
$(document).ready(function(){
  refundObj.doTinit();
  var param = location.search;

  refundObj.tradeId = param.substr(param.lastIndexOf('=')+1);
  refundObj.getTradesList(refundObj.tradeId);

  /**图片上传**/
  $("#input_file").change(function(e) {
    Array.prototype.forEach.call(e.target.files, function(f) {
      refundObj.upLoadImg(f);
    });
  });
  $(".refund_submit").click(function () {

    refundObj.doRefund();
  });
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
  $("#refund_cash2").keyup(function () {
    var value = $(this).val();
    value = value.replace(/[^\d^\.]/g,'');
    value = value>refundObj.cashPaymentPay?refundObj.cashPaymentPay:value;
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
  $("#refund_health_insurance").keyup(function () {
    var value = $(this).val();
    value = value.replace(/[^\d^\.]/g,'');
    value = value>refundObj.medicalInsuranceCardPay?refundObj.medicalInsuranceCardPay:value;
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
  $('.img_div').live('mousemove',function(){
    $(this).find('a').removeClass("lee_hide");
  }).live('mouseout',function(){
    $(this).find('a').addClass("lee_hide");
  });
  $(".img-delete").live('click',function(){
     $(this).parent().remove();
  });

  $('[name=is_refund_goods]').bind('change',function () {
    var is_refund_goods = $('[name=is_refund_goods]:checked').val();
    var $expressno = $('#expressno');
    if(is_refund_goods != 1){
      $expressno.prop('readOnly',true);
      $expressno.val('');
    }else{
      $expressno.prop('readOnly',false);
    }
  });

  $('[name=is_refund_goods]').trigger('change');
});

/****退款****/
var refundObj = {
  operatorId:"",//操作员Id
  operatorName:"",//操作员名称
  merchantId:"",//商家Id
  merchantName:"",//商家名称
  payStyle:"",//支付方式
  storeId:"",//门店id
  tradeId:"",//订单id
  applyRefundMoney:"",//申请退款金额 单位分
  realRefundMoney:"",//实际退款金额 单位分
  isRefundGoods:"",//是否需要退货 0不需要  1需要
  refundExpressNo:"",//退款快递号
  reason:"",//退货原因
  explain:"",//退货说明
  voucher:"",//退货图片凭证 JSON
  operatorType:"200",//操作者类型 100=用户 200=商户
  cashPaymentPay:"",
  medicalInsuranceCardPay:"",
  getTradesList:function(trade_id){
    console.log(trade_id);
    var getTradeDetailUrl = "/merchant/selectTradesDetailsold?tradesId="+trade_id;
    $.get(getTradeDetailUrl,function (res) {
      console.log("Res");
      console.log(res);
      $(".trades-id").text(res.value.tradesId);
      $(".real-money").text(parseFloat(res.value.realPay/100.00).toFixed(2));
      if(res.value.payStyle == "health_insurance"){
        $("#line_up").addClass("lee_hide");
        $("#payStyle_do").val(res.value.payStyle);
        $("#cash_part").text(parseFloat((res.value.realPay-res.value.medicalInsuranceCardPay-res.value.lineBreaksPay)/100.00).toFixed(2));
        $("#yibao_part").text(parseFloat(res.value.medicalInsuranceCardPay/100.00).toFixed(2));
        $("#linedown_discount").text(parseFloat(res.value.lineBreaksPay/100.00).toFixed(2));
        refundObj.cashPaymentPay = (res.value.realPay-res.value.medicalInsuranceCardPay-res.value.lineBreaksPay)/100.0;
        refundObj.medicalInsuranceCardPay = res.value.medicalInsuranceCardPay/100.0;
      }else{
        $("#line_down").addClass("lee_hide");
        $("#payStyle_do").val(res.value.payStyle);
      }

      if(res.value.dealFinishStatus==1){
        $(".refund_submit").hide();
      }

      if(res.value.payStyle){
        var payStyle= res.value.payStyle;
        console.log("payStyle:"+payStyle);
        if(payStyle == "ali"){
          $(".pay-style").text("支付宝");
        }else if(payStyle == "wx"){
          $(".pay-style").text("微信");
        }else if(payStyle == "bil"){
          $(".pay-style").text("快钱");
        }else if(payStyle == "unionPay"){
          $(".pay-style").text("银联");
        }else if(payStyle == "health_insurance") {
          $(".pay-style").text("医保");
        }else if(payStyle == "cash") {
          $(".pay-style").text("现金");
        }else if(payStyle == "integral"){
          $(".pay-style").text("积分兑换");
          $("#integral").hide();
          $("#line_down").hide();
          $("#line_up").hide();
        }else{
          $(".pay-style").text("信息丢失");
        }
      }else{
        $(".pay-style").text("信息丢失");
      }

      $(".post-fee").text(res.value.postFee/100.00);

      $('[name="is_refund_goods"][value="'+res.value.isRefund+'"]').attr("checked",true);

      $("#expressno").val(res.value.postNumber);

      $("#max_cash_price_span").val(res.value.realPay/100.00);

      $("#refunde_exp").text(res.value.sellerMemo);
      refundObj.applyRefundMoney = res.value.realPay/100.00;
      $("#max_cash_price_span").text(parseFloat(res.value.realPay/100.00).toFixed(2));
      
      if(res.value.integralUsed==null || res.value.integralUsed==0){
        $("#refund_scoring").html("0积分&nbsp;&nbsp;&nbsp;");
        $("#refund_scoring").next().remove();
        $("#deduction").hide();

      }else{
        $("#refund_scoring").html(res.value.integralUsed+"积分&nbsp;&nbsp;&nbsp;");
      }
      if(res.value.map != null && res.value.map.hasOwnProperty('orderUse')) {
        $('#refund_preferential').text(res.value.map.orderUse.marked_words);
        console.log(res.value.map.orderUse.status);
        if(res.value.map.orderUse.status==0){
          $("#a1").attr("checked",true);
        }
        if(res.value.map.orderUse.status==1){
          $("#a2").attr("checked",true);
        }
      } else{
        $('#refund_preferential').text('未使用优惠券');
        $('#refund_preferential').next().remove();
      }
    });

  },
  upLoadImg:function(f){
    $(".tmp_pic_a").html("<img src='/templates/views/resource/aweb/img/loading.gif' style='width:100px;' />正在上传。。。");
    var formData = new FormData();
    formData.append("file",  f);
    $.ajax({
      url: '/merchant/localpictureUpload',
      type: 'POST',
      success: function(data){
        console.log(data);
        if(data.code == 200){
          $("#img_pre").append("<div class='img_div'><img name='voucher' src='"+data.data.url+"'  /><a class='img-delete lee_hide' href='javascript:void(0)' >X</a></div>");
        }else{
          alert("图片上传失败！")
        }

      },
      error: function(data){
      },
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    });
  },

  doRefund:function () {

    refundObj.applyRefundMoney = $(".real-money").text();
    if($("#payStyle_do").val()=="health_insurance"){
      if(!$('[name="refund_cash2"]').val() && !$('[name="refund_health_insurance"]').val()){
        alert("请填写退款金额");
        return;
      }
      var cash2 = !$('[name="refund_cash2"]').val()?0:$('[name="refund_cash2"]').val();
      var insurance = !$('[name="refund_health_insurance"]').val()?0:$('[name="refund_health_insurance"]').val();
      refundObj.realRefundMoney = parseFloat(cash2)+parseFloat(insurance);
    }else{
      refundObj.realRefundMoney = $("#refund_cash").val();
    }

    refundObj.reason = "商家退款";
    refundObj.explain = $("#refunde_exp").val();
    $('[name="voucher"]').each(function (index,ele) {
      refundObj.voucher = refundObj.voucher +","+ $(ele).attr("src");
    });

    if(refundObj.voucher)refundObj.voucher = refundObj.voucher.substr(1);
    refundObj.isRefundGoods = $('[name="is_refund_goods"]:checked').val();
    refundObj.refundExpressNo = $('#expressno').val();
    if(!refundObj.refundExpressNo && refundObj.isRefundGoods == '1') {
        alert('请输入运单号!');
        return;
    }
    refundObj.payStyle = $('.pay-style').text();
    var data = {};
    if(refundObj.payStyle !="积分兑换"){
      if(!refundObj.realRefundMoney || (refundObj.realRefundMoney == 0 && refundObj.applyRefundMoney != 0)){
        alert("请输入正确的退款金额!");
        return;
      }
    }

    data.applyRefundMoney = Math.round(refundObj.applyRefundMoney * 100);
    data.realRefundMoney = Math.round(refundObj.realRefundMoney * 100);
    data.reason = refundObj.reason;
    data.explain = refundObj.explain;
    data.voucher = refundObj.voucher;
    data.isRefundGoods = refundObj.isRefundGoods;
    data.refundExpressNo = refundObj.refundExpressNo;
    data.payStyle = refundObj.payStyle;
    data.tradeId = refundObj.tradeId;
    data.is_coupon = $('[name="a2"]:checked').val();//优惠券
    data.is_integral = $('[name="a1"]:checked').val();//积分
    data.operatorType = 200;//商家主动退款


    if(flags){
      flags=false;
      $.post("/merchant/merchantRefund",data,function (res) {
        if(res.code == "000"){
          if(res.message == "不能重复发起退款"){
            alert("不能重复发起退款");
            location.href='order_list';
          }
          alert("退款成功");
          location.href='order_list';
        }else{
          alert(res.message); //将打印错误信息
        }
      });
    }
    refundObj.voucher = "";
    return;
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

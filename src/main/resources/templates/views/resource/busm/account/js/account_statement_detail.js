function GetRequest() {
  var url = location.search; //获取url中"?"符后的字串
  var theRequest = new Object();
  if (url.indexOf("?") != -1) {
    var str = url.substr(1);
    strs = str.split("&");
    for(var i = 0; i < strs.length; i ++) {
      theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
    }
  }
  return theRequest;
}

$(function () {

  $(".top-bar").hide();
  $(".lee_top").hide();
  $(".sidebar").hide();
  $(".clearfix").hide();
  $(".foot-main").hide();

  var Request = new Object();
  Request = GetRequest();
  var params = {
    financeNo: Request["financeNo"].replace('&siteId', ''),
    siteId: Request["siteId"]
  };

  $.ajax({
    type: 'post',
    dataType:'json',
    //contentType : 'application/json;charset=utf-8',
    url: "get_merchant_account_statement_detail",
    data : params,
    success: function (data) {
      //data=eval("("+data+")");
      if(data.code == 000){
        var result = data.value;
        console.log(result);
        $(".shop_name").find("h2").html(result.merchant_name);
        $(".shop_name").find("h2").next().html(result.seller_id);
        $(".statement_title").find("span").html("账单编号：" + result.finance_no);
        $(".statement_title").find("span").next().html("账单日：" + result.pay_day);
        $(".statement_detail").find("span").html(result.settlement_start_date + " 至 " + result.settlement_end_date);
        // 交易信息
        var tmpl = document.getElementById('linkInfo').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#infoId").html(doTtmpl(result));

        //本期应收
        var daishou=result.total_pay-result.refund_total;
        var zhichu=result.platform_total+result.commission_total+result.post_total;
        var yingshou=daishou-zhichu+0;//上期结转
        $("#yingshou").append((yingshou/100).toFixed(2));
        $(".daishou").append((daishou/100).toFixed(2));
        $(".zhichu").append(zhichu<0?('('+(zhichu/100).toFixed(2)+')'):(zhichu/100).toFixed(2));
        // $("#jiezhuan").append(result.shangqijiezhuan<0?('('+result.shangqijiezhuan/100+')'):(result.shangqijiezhuan/100).toFixed(2));
        $("#jiezhuan").append((0).toFixed(2));
        //计算总计
        var shouruA=0;
        var tuikuanA=0;
        var shouru=0;
        var tuikuan=0;
        var shouxufei=0;
        var yongjin=0;
        var xiaoji=0;
        var peisongfei=0;
        for(var i=0;i<result.list.length;i++){
          var temp=0;
          var shouruA=shouruA+result.list[i].total_payA;
          var tuikuanA=tuikuanA+result.list[i].refund_totalA;
          shouru=shouru+result.list[i].total_pay;
          tuikuan=tuikuan+result.list[i].refund_total;
          yongjin=yongjin+result.list[i].commission_total;
          shouxufei=shouxufei+result.list[i].platform_total;
          peisongfei=peisongfei+result.list[i].post_total;
          temp=result.list[i].total_pay-result.list[i].refund_total-result.list[i].commission_total-result.list[i].platform_total-result.list[i].post_total;
          xiaoji=xiaoji+temp;
        }
        result["shouruA"]=shouruA;
        result["tuikuanA"]=tuikuanA;
        result["shouru"]=shouru;
        result["tuikuan"]=tuikuan;
        result["shouxufei"]=shouxufei;
        result["yongjin"]=yongjin;
        result["peisongfei"]=peisongfei;
        result["xiaoji"]=xiaoji;

        console.log(result);
        // 主营业务
        var mainTemp=document.getElementById('mainBusinessTemp').innerHTML;
        var mainBusinessTmpl = doT.template(mainTemp);
        $("#mainBusinessId").append(mainBusinessTmpl(result));

        var status = result.status;
        if(status == 0){
          $(".statement_status").html("未处理");
          // $("#tipsId").html("上期应付"+5000.00+"元未处理，请及时处理。");
        }
        if(status == 100){
          $(".statement_status").html("未支付");
        }
        if(status == 110){
          $(".statement_status").html("延期支付");
        }
        if(status == 200){
          $(".statement_status").html("支付部分");
        }
        if(status == 900){
          $(".statement_status").html("已结清");
          // $("#tipsId").html("上期应付"+5000.00+"元已结清，请及时查收。");
        }
        $(".need_pay").html(result.need_pay);
        $(".real_pay").html(result.real_pay);
      }else{
        $(".shop_account_info").html("<font color='red' size='5'>数据获取失败！</font>");
      }
    }
  });

});

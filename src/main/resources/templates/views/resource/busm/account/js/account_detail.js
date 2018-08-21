/**
 * Created by zw on 2017/3/12.
 */
var ACCOUNT = {};

var page_total = 0;
var pagesize = 0;
var total = 0;
var params={};




  $(function () {

    ACCOUNT.init();
  });



  Date.prototype.format = function(format){
    var o = {
      "M+" : this.getMonth()+1, //month
      "d+" : this.getDate(), //day
      "h+" : this.getHours(), //hour
      "m+" : this.getMinutes(), //minute
      "s+" : this.getSeconds(), //second
      "q+" : Math.floor((this.getMonth()+3)/3), //quarter
      "S" : this.getMilliseconds() //millisecond
    }
  if(/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
  }

  for(var k in o) {
    if(new RegExp("("+ k +")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    }
  }
  return format;
}
ACCOUNT.GetNum = {
  settings: {
    //modalID: '#modal-slider',
  },
  init: function () {

    /*this.ajaxGetList(1);*/
    this.even();
  },
  even: function () {
    $("#search").on("click", function () {
      $("#dd").remove();
      ACCOUNT.GetNum.ajaxGetList(1);
    });
    $(".select_trades_detail").live("click",function(){
      var text = $(this).html();
      text = "1001791481788286884";
      window.location.href= "/jk51b/selectTradesDetails?tradesId=";
      alert(text);
      $.ajax({
        type: 'post',
        url: "/jk51b/selectTradesDetails",
        data: {"tradesId":text},
        dataType: 'json',
        success: function (data) {
          console.log(data);
        }
      });
    });
  },
  ajaxGetList: function (pageno) {
    pageno = pageno || 1;
    var pageSize = 15;

    var datas = {
      "select_type":"by_order",
      "merchantName": $("input[name=merchant_name]").val(),
      "site_id": $("input[name=merchant_id]").val(),
      "payType": $("#pay_style").find("option:selected").val(),
      "accountStatus": $("#accountStatus").find("option:selected").val(),
      "checkStatus": $("#account_checking_status").find("option:selected").val(),
      "settlementStatus": $("#summary_status").find("option:selected").val(),
      "tradesId": $('input[name=trades_id]').val(),
      "payNumber": $('input[name=pay_number]').val(),
      "dealStartTime": $('input[name=start_time]').val(),
      "dealEndTime": $('input[name=end_time]').val(),
      "paymentStartTime": $('input[name=pay_start_time]').val(),
      "paymentEndTime": $('input[name=pay_end_time]').val(),
      "financeNo":$("input[name=finance_no]").val()
    };
    var paymentStartTime=$('input[name=pay_start_time]').val();
    var paymentEndTime=$('input[name=pay_end_time]').val();
    if(paymentStartTime>paymentEndTime){
      layer.msg("开始时间不能大于结束时间");
      return false;
    }
    var isCount = false;
    if(!document.cachedCond || document.cachedCond != JSON.stringify(datas)){
      //window.cachedCond = JQuery.extends(true,{},datas);
      document.cachedCond = JSON.stringify(datas);
      isCount = true;
    }
    datas.count = isCount;
    datas.pageNum= pageno;
    datas.pageSize=pageSize;

    console.log(datas);
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_detail_list",
      data: datas,
      dataType: 'json',
      success: function (data) {
        $("#detail-list").empty();
        var page_total,pagesize,total;
        if(data.pages){
          document.pages = data.pages;
          document.total = data.total;
        }
        page_total = document.pages;
        pagesize = document.size;
        ACCOUNT.total = document.total;
        console.log(data);

        pageInfo($('.pageinfo'), pageno, page_total, pagesize, ACCOUNT.total, ACCOUNT.GetNum.ajaxGetList);
        var tmpl = document.getElementById('accountDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#detail-list").append(doTtmpl(data));

      }
    });
  }
};
ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();

};
$(function () {
  ACCOUNT.init();
});

/*导出报表*/
ACCOUNT.query = function(pageNum,callback){
  var params = ACCOUNT.getQueryCondition(pageNum);
  $.post('get_account_detail_list', params, callback);
};

ACCOUNT.getQueryCondition = function (pageNum) {
  var params = {
    "select_type":"by_order",
    "merchantName": $("input[name=merchant_name]").val(),
    "site_id": $("input[name=merchant_id]").val(),
    "payType": $("#pay_style").find("option:selected").val(),
    "accountStatus": $("#accountStatus").find("option:selected").val(),
    "checkStatus": $("#account_checking_status").find("option:selected").val(),
    "settlementStatus": $("#summary_status").find("option:selected").val(),
    "tradesId": $('input[name=trades_id]').val(),
    "payNumber": $('input[name=pay_number]').val(),
    "dealStartTime": $('input[name=start_time]').val(),
    "dealEndTime": $('input[name=end_time]').val(),
    "paymentStartTime": $('input[name=pay_start_time]').val(),
    "paymentEndTime": $('input[name=pay_end_time]').val(),
    "financeNo":$("input[name=finance_no]").val()
  };

  return params;
}

  $(document).ready(function () {
    $('[name=search]').bind('click', function () {
      settle.query(1, settle.fill);
    })
    $('[name=exportBtn]').bind('click', function () {
      var tips;
      ACCOUNT.query(0,function () {

      if (ACCOUNT.total == 0) {
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      }else if (ACCOUNT.total > 10000) {
        tips = '<p id="result-tips">本次查询结果<span style="color: red" id="row_span">' + ACCOUNT.total  + '</span>条，已超过10000条的最大值<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出10000条，超过时请分批次下载</p>';
      } else{
         // tips = '<p id="result-tips">根据本次查询条件，共查询到' + ACCOUNT.total  + '条结果,<a href="export?' + $.param(params) + '" target="_blank"> 请点击下载</a></p>';

        var params=ACCOUNT.getQueryCondition();
        tips = '<p id="result-tips">根据本次查询条件，共查询到' + ACCOUNT.total + '条结果,' +
          '<a onclick="export_51();" > 请点击下载</a></p>';
      }
      $("#modal_body").html(tips);
      $("#export-dialog").modal("show");
      });
    });
  });
function export_51(){
  var params = ACCOUNT.getQueryCondition(0);
  console.log(params);
  var form = $("<form>");//定义一个form表单
  form.attr("style", "display:none");
  form.attr("target", "");
  form.attr("method", "post");
  for (var i in params) {
    form.append('<input type="hidden" name="' + i + '" value="' + params[i] + '" >');
  }
  console.log(form);
  form.attr("action", "/jk51b/export");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
}





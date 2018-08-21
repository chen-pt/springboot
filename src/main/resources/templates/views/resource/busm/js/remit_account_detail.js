/**
 * Created by luf on 2017/7/25.
 */

var ACCOUNT = {};
var page_total = 0;
var pagesize = 0;
var total = 0;




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
  init: function () {
    var now = new Date(new Date().getTime() - 86400000);
    var monthweekdate = new Date(now-30*24*3600*1000);
    var nowStr=now.format("yyyy-MM-dd");
    var monthweekdateStr = monthweekdate.format("yyyy-MM-dd");
/*    $("#start_time").val(monthweekdateStr);
    $("#end_time").val(nowStr);*/

    // this.ajaxGetList(1);
    this.even();
  },
  even: function () {
    $("#search").on("click", function () {
      ACCOUNT.GetNum.ajaxGetList(1);
    });
  },
  ajaxGetList: function (pageNum) {
    pageNum = pageNum || 1;
    var pageSize = 15;
    var datas = {
      "merchantName": $("input[name=merchant_name]").val(),
      "merchantId": $("input[name=merchant_id]").val(),
      "payStyle": $("#pay_style").find("option:selected").val(),
      "remitAccountStatus": $("#remit_account_status").find("option:selected").val(),
      "accountCheckingStatus": $("#account_checking_status").find("option:selected").val(),
      "tradesId": $('input[name=trades_id]').val(),
      "payNumber": $('input[name=pay_number]').val(),
      "payStartTime": $("#start_time").val(),
      "payEndTime": $("#end_time").val(),
      "accountStatus": $("#account_status").find("option:selected").val(),
      "pageSize": pageSize,
    };
    var payStartTime=$('input[name=start_time]').val();
    var payEndTime=$('input[name=end_time]').val();
    if(payStartTime>payEndTime){
      layer.msg("开始时间不能大于结束时间");
      return false;
    }
    var isCount = false;
    if(!document.cachedCond || document.cachedCond != JSON.stringify(datas)){
      //window.cachedCond = JQuery.extends(true,{},datas);
      document.cachedCond = JSON.stringify(datas);
      isCount = true;
    }


    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_remit",
      data: datas,
      dataType: 'json',
      success: function (data) {
        $("#detail-list").empty();
        page_total = data.pages;
        pagesize = data.pageSize;
        total = data.total;
        console.log(data);
        ACCOUNT.total=total;
        pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
        var tmpl = document.getElementById('accountDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#detail-list").append(doTtmpl(data));
        pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
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
  $.post('get_account_remit', params, callback);
};
ACCOUNT.getQueryCondition = function (pageNum) {
  var params = {
      "merchantName": $("input[name=merchant_name]").val(),
      "merchantId": $("input[name=merchant_id]").val(),
      "payStyle": $("#pay_style").find("option:selected").val(),
      "remitAccountStatus": $("#remit_account_status").find("option:selected").val(),
      "accountCheckingStatus": $("#account_checking_status").find("option:selected").val(),
      "tradesId": $('input[name=trades_id]').val(),
      "payNumber": $('input[name=pay_number]').val(),
      "payStartTime": $("#start_time").val(),
      "accountStatus": $("#account_status").find("option:selected").val(),
      "payEndTime": $("#end_time").val()
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
  form.attr("action", "/jk51b/remit_export");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
}

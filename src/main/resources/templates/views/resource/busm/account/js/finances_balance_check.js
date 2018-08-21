/**
 * Created by twl on 2018/1/13.
 */
var ACCOUNT = {};

var page_total = 0;
var pagesize = 0;
var total = 0;

ACCOUNT.GetNum = {

  settings: {
    //modalID: '#modal-slider',
  },
  init: function () {
    //this.ajaxGetList(1);
    this.even();
  },
  even: function () {
    $("#search").on("click", function () {

      ACCOUNT.GetNum.ajaxGetList(1);
    });
  },
  ajaxGetList: function (pageno) {
    pageno = pageno || 1;
    var pageSize = 15;
    var datas = {
      "siteId": $("input[name=siteId]").val(),
      "merchantName": $("input[name=merchantName]").val(),
      "startDate": $("input[name=startDate]").val(), /*出账日*/
      "endDate": $("input[name=endDate]").val(),/*出账日*/
      "pageNum": pageno,
      "pageSize": pageSize
    }
    console.log(datas);
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "find_finances_balance",
      data: datas,
      // dataType: 'json',
      success: function (data) {
        $("#detail-list").empty();
        page_total = data.pages;
        pagesize = data.pageSize;
        total = data.total;
        console.log(data);
        ACCOUNT.total=document.total;


        pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);

        var tmpl = document.getElementById('accountDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#detail-list").append(doTtmpl(data.list));
        pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
      }
    });
  }
};

//跳转到划账表
function  toRemitDetail(siteId) {
  var startDate=$("input[name=startDate]").val();
  var endDate=$("input[name=endDate]").val();
  window.open(href="/jk51b/account_remit?siteId="+siteId+"&remitStartTime="+startDate+"&remitEndTime="+endDate);
}

//跳转到商家账单
function  toMerchantFinances(siteId) {
  var startDate=$("input[name=startDate]").val();
  var endDate=$("input[name=endDate]").val();
  window.open(href="/jk51b/account_list?siteId="+siteId+"&payStartTime="+startDate+"&payEndTime="+endDate);
}

ACCOUNT.init = function () {
  ACCOUNT.GetNum.init();
};
$(function () {
  ACCOUNT.init();
});




/*导出报表*/
ACCOUNT.query = function(pageNum,callback){
  var params = ACCOUNT.getQueryCondition(pageNum);
  $.post('find_finances_balance', params, callback);
};
ACCOUNT.getQueryCondition = function (pageNum) {
  var params = {
    "siteId": $("input[name=siteId]").val(),
    "merchantName": $("input[name=merchantName]").val(),
    "startDate": $("input[name=startDate]").val(), /*出账日*/
    "endDate": $("input[name=endDate]").val()  /*出账日*/
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
      if (total == 0) {
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      }else if (total > 10000) {
        tips = '<p id="result-tips">本次查询结果<span style="color: red" id="row_span">' + total  + '</span>条，已超过10000条的最大值<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出10000条，超过时请分批次下载</p>';
      } else{
        // tips = '<p id="result-tips">根据本次查询条件，共查询到' + ACCOUNT.total  + '条结果,<a href="export?' + $.param(params) + '" target="_blank"> 请点击下载</a></p>';
        var params=ACCOUNT.getQueryCondition();
        tips = '<p id="result-tips">根据本次查询条件，共查询到' + total + '条结果,' +
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
  form.attr("action", "/jk51b/financeBalance_check_export");
  $("body").append(form);//将表单放置在web中
  form.submit();//表单提交
}

/**
 * Created by Administrator on 2017/3/23.
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
    this.ajaxGetList(1);
    this.even();
  },
  even: function () {
    $("#search").on("click", function () {

      ACCOUNT.GetNum.ajaxGetList(1);
    });
    $(".select_trades_detail").live("click",function(){
      var text = $(this).html();
      // text = "1001791481788286884";
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
      "sellerId": $("input[name=merchant_id]").val(), /*商家编号*/
      "sellerName": $("input[name=seller_name]").val(),        /*商家名称*/
      "auditStatus": $('#audit_status option:selected').val(), /*审核状态*/
      "status": $('#status option:selected').val(),/*结算状态*/
      "financeNo": $("input[name=account_number]").val(), /*账单编号*/
      "sOutDate": $("input[name=out_date_start]").val(), /*出账日*/
      "eOutDate": $("input[name=out_date_end]").val(),/*出账日*/
      "pageNum": pageno,
      "pageSize": pageSize,
      "payStyle": $('#summary_status option:selected').val()
    }
/*    var datas = {
      "pageNum": pageno,
      "pageSize": pageSize,
      "financeNo": $("input[name=debit_id]").val(),
      "payStyle": $('#summary_status option:selected').val()
    };*/
    console.log(datas);
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_sum_list",
      data: datas,
      dataType: 'json',
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
        $("#detail-list").append(doTtmpl(data));
        pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
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




ACCOUNT.query1 = function(pageNum,callback){
  var params = ACCOUNT.getQueryCondition1(pageNum);
  $.post('get_product_list', {params: JSON.stringify(params)}, callback);
};
ACCOUNT.getQueryCondition1 = function (pageNum) {
  var params = {
    "sellerId": $("input[name=merchant_id]").val(), /*商家编号*/
    "sellerName": $("input[name=seller_name]").val(),        /*商家名称*/
    "auditStatus": $('#audit_status option:selected').val(), /*审核状态*/
    "status": $('#status option:selected').val(),/*结算状态*/
    "financeNo": $("input[name=account_number]").val(), /*账单编号*/
    "sOutDate": $("input[name=out_date_start]").val(), /*出账日*/
    "eOutDate": $("input[name=out_date_end]").val(),/*出账日*/
    "payStyle": $('#summary_status option:selected').val()
  };
  return params;
}

var dates={};
var datas = {
  "sellerId": $("input[name=merchant_id]").val(), /*商家编号*/
  "sellerName": $("input[name=seller_name]").val(),        /*商家名称*/
  "auditStatus": $('#audit_status option:selected').val(), /*审核状态*/
  "status": $('#status option:selected').val(),/*结算状态*/
  "financeNo": $("input[name=account_number]").val(), /*账单编号*/
  "sOutDate": $("input[name=out_date_start]").val(), /*出账日*/
  "eOutDate": $("input[name=out_date_end]").val(),/*出账日*/
  "payStyle": $('#summary_status option:selected').val()
}
/*导出报表*/
$(document).ready(function () {
  $('[name=search]').bind('click', function () {
    settle.query(1, settle.fill);
  })
  $('[name=exportBtn]').bind('click', function () {
    var tips;
    ACCOUNT.query1(0,function () {
      if (total == 0) {
        tips = '<p id="result-tips">没有查询到可供导出的结果集，请检查查询条件。</p>';
      } else if (total > 1000) {
        tips = '<p id="result-tips">本次查询结果<span style="color: red" id="row_span">' + ACCOUNT.total + '</span>条，已超过1000条的最大值<br>请修改查询条件，分批次下载。</p>';
        tips += '<p style="color: orange">*每次最多可以导出1000条，超过时请分批次下载</p>';
      } else {
        var params=ACCOUNT.getQueryCondition1();
        tips = '<p id="result-tips">根据本次查询条件，共查询到' + total + '条结果,<a href="export_by_account_chargeoff?' + $.param(params) + '" target="_blank"> 请点击下载</a></p>';
      }
      $("#modal_body").html(tips);
      $("#export-dialog").modal("show");
    });
  });
});
//查看详情
function openDetail(financeNo,siteId) {

  window.open(href="account_statement_detail?financeNo="+financeNo+"&siteId="+siteId);
}

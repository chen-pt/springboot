/**
 * Created by xiapeng on 2017/8/31.
 */

var ACCOUNT = {};
var page_total = 0;
var pagesize = 0;
var total = 0;

ACCOUNT.GetNum = {
  init: function () {
    this.ajaxGetList(1);
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
      "sellerId": $("input[name=merchant_id]").val(),
      "payType": $("#pay_style").find("option:selected").val(),
      "tradesId": $('input[name=trades_id]').val(),
      "financeNo":$("input[name=finance_no]").val(),
      "payStatus": $("#pay_status").find("option:selected").val(),
      "createStartTime": $('input[name=create_start_time]').val(),
      "createEndTime": $('input[name=create_end_time]').val(),
      "payStartTime": $('input[name=pay_start_time]').val(),
      "payEndTime": $('input[name=pay_end_time]').val(),
      "dealStartTime": $('input[name=deal_start_time]').val(),
      "dealEndTime": $('input[name=deal_end_time]').val(),
      "moneyStartTime": $('input[name=money_start_time]').val(),
      "moneyEndTime": $('input[name=money_end_time]').val(),
      "pageNum": pageNum,
      "pageSize": pageSize,
    }
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_run",
      data: datas,
      dataType: 'json',
      success: function (data) {
        $("#detail-list").empty();
        page_total = data.pages;
        pagesize = data.pageSize;
        total = data.total;
        console.log(data);
        ACCOUNT.total=document.total;
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

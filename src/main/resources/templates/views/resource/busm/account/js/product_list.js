/**
 * Created by zhangduoduo on 2017/3/13.
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
    this.ajaxGetList();
    this.even();
  },
  even: function () {
    $("#search").on('click', function () {
      ACCOUNT.GetNum.ajaxGetList(1);
    });
  },
  ajaxGetList: function (pageno) {
    var pageSize = 15;
    var data = {
      "pageNum":pageno,
      "pageSize":pageSize,
      "sellerName": $("input[name=seller_name]").val(),
      "sellerId": $("input[name=merchant_id]").val(),
      "invoice": $('#invoice option:selected').val(),
      "auditStatus": $('select[name=audit_status] option:selected').val(),
      "status": $('#status option:selected').val(),
      "sActualDate": $('input[name=pay_date_start]').val(),
      "eActualDate": $('input[name=pay_date_end]').val(),
      "settlementDate": $('input[name=pay_day]').val(),
      "sPayment": $('input[name=pay_day_start]').val(),
      "ePayment": $('input[name=pay_day_end]').val(),
      "payStyle": $('#pay_style option:selected').val(),
      "sPay": $('input[name=total_pay_start]').val(),
      "ePay": $('input[name=total_pay_end]').val(),
    };
    pageno = pageno || 1;
    $("#account-list").html('');
    $.ajax({
      type: 'post',
      url: "get_product_list",
      dataType: 'json',
      data:data,
      success: function (data) {
        page_total = data.pages;
        pagesize = data.pageSize;
        total = data.total;
        pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
        var tmpl = document.getElementById('accountList').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#account-list").append(doTtmpl(data));
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

/**
 * Created by twl on 2017/6/22.
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
    pageno = pageno || 1;
    var pageSize = 15;
    var data = {
      "pageNum":pageno,
      "pageSize":pageSize,
      "siteId": $("input[name=site_id]").val(),
      "payStyle": $('#pay_style option:selected').val(),
      "settlementStatus": $('select[name=settlement_status] option:selected').val(),
      "dealFinishStatus": $('#deal_finish_status option:selected').val(),
      "financeNo": $('#finance_no').val(),
      "tradesId": $('#trades_id').val(),
      "isPayment": $('#is_payment option:selected').val(),
      "sTime": $('input[name=start_time]').val(),
      "eTime": $('input[name=end_time]').val()
    };

    $("#detail-list").html('');
    $.ajax({
      type: 'post',
      url: "get_trades_list",
      dataType: 'json',
      data:data,
      success: function (data) {
        page_total = data.pages;
        pagesize = data.pageSize;
        total = data.total;
        pageInfo($('.pageinfo'), pageno, page_total, pagesize, total, ACCOUNT.GetNum.ajaxGetList);
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

/**
 * Created by Administrator on 2017/3/21.
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
      "pageNum": pageno,
      "pageSize": pageSize,
      "sellerId": $("input[name=merchant_id]").val(),
      "sellerName": $("input[name=merchant_name]").val(),
      "executeStatus": $('#summary_status option:selected').val(),
      "financeNo":$("input[name=debit_id]").val(),
      "sOutDate": $("input[name=start_time]").val(),
      "eOutDate": $("input[name=end_time]").val()
    };
    console.log(datas);
    $("#detail-list").html('');
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_log_list",
      data: datas,
      dataType: 'json',
      success: function (data) {
        $("#detail-list").empty();
        var page_total,pagesize,total;
        if(data.value.pages){

          document.pages = data.value.pages;
          document.total = data.value.total;
        }

        page_total = data.value.pages;
        pagesize = data.value.pageSize;
        ACCOUNT.total = data.value.total;

        var tmpl = document.getElementById('accountDetail').innerHTML;
        var doTtmpl = doT.template(tmpl);
        $("#detail-list").append(doTtmpl(data));
        pageInfo($('.pageinfo'), pageno, page_total, pagesize,ACCOUNT.total, ACCOUNT.GetNum.ajaxGetList);

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

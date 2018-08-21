/**
 * Created by xiapeng on 2017/7/25.
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
      "error_code": $("#error_code").find("option:selected").val(),
      "pageNum": pageNum,
      "pageSize": pageSize,
    }
    AlertLoading($("#detail-list"));
    $.ajax({
      type: 'post',
      url: "get_account_exception",
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










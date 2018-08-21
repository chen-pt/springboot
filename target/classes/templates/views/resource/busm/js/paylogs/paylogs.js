$(document).ready(function(){
  loadData(1);
  $("#search").bind("click", function() {
    loadData();
  })
});

function loadData(pageNum) {
  var pageSize = 15;
  pageNum = pageNum || 1;
  var postdata = {};
  postdata.tradesInvoice = $("#invoice").val();
  postdata.payStatus = $('#audit_status').val();
  postdata.ybAccount = $("#ybAccount").val();
  postdata.payStyle = $("#pay_style").val();
  postdata.tradesId = $("#id").val();
  postdata.pageNo = pageNum;
  postdata.pageSize = pageSize;
  if(pageNum > 1) {
    postdata.total = $("#totalNum").val();
    postdata.isCount = false;
  }
  AlertLoading($("#account-list"));
  $.ajax({
    type: 'POST',
    data: postdata,
    url: '/jk51b/findPayLogs',
    success: function (data) {
      $("#account-list").empty();
      var tmpl=document.getElementById('index_list').innerHTML;
      var doTtmpl=doT.template(tmpl);
      console.log(doTtmpl);
      if(data && data.code=="000") {
        var page_total = data.value.page.pages;
        var pagesize = data.value.page.pageSize;
        var total = data.value.page.total;
        $("#account-list").html(doTtmpl(data));
        $("#totalNum").val(total);
        pageInfo($('.pageinfo'), pageNum, page_total, pagesize, total, loadData);
      }
    }
  });
}

function formatDate(date, format) {
  /*
   * 使用例子:format="yyyy-MM-dd hh:mm:ss";
   */
  var o = {
    "M+" : date.getMonth() + 1, // month
    "d+" : date.getDate(), // day
    "h+" : date.getHours(), // hour
    "m+" : date.getMinutes(), // minute
    "s+" : date.getSeconds(), // second
    "q+" : Math.floor((date.getMonth() + 3) / 3), // quarter
    "S" : date.getMilliseconds()
    // millisecond
  }

  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4
      - RegExp.$1.length));
  }

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1
        ? o[k]
        : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}


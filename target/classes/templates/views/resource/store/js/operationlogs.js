/**
 * Created by admin on 2017/3/30.
 */
var pageSize = 15;
var pageNum = 1;
$(function () {
  loglist(0);
  $("#log-search-btn").click(function () {
    loglist(0);
  });
})
var loglist = function () {
  $.ajax({
    url: "/common/selectiveLogs",
    type: "POST",
    data: {
      "operator": $("#username").val(),
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize
    },
    success: function (data) {
      pagination_pages = data.logInfos.pages;
      pagination_totals=data.logInfos.total;
      $("#log-list").empty();
      if (data.logInfos.list!=null && data.logInfos.list) {
        var tr = "";
        for (var i = 0; i < data.logInfos.list.length; i++) {
          tr += "<tr><td>" + data.logInfos.list[i].operator + "</td><td>" + data.logInfos.list[i].action + "</td>" +
            "<td>" + new Date(parseFloat(data.logInfos.list[i].create_time)).format("yyyy-MM-dd hh:mm:ss") + "</td></tr>";
        }

        $("#log-list").append(tr);
        $("#pagediv").html("<span class='pageinfo'></span>")
      } else {
        tr = "<tr> <td colspan='99' style='text-align: center;'>没有找到该记录</td></tr>";
        $("#log-list").append(tr);
      }
      addpage(loglist);
    }
  })
}


/**
 *时间格式转换
 * @param format timestamp类型时间格式
 * @returns {*}
 */
Date.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1,
    // month
    "d+": this.getDate(),
    // day
    "h+": this.getHours(),
    // hour
    "m+": this.getMinutes(),
    // minute
    "s+": this.getSeconds(),
    // second
    "q+": Math.floor((this.getMonth() + 3) / 3),
    // quarter
    "S": this.getMilliseconds()
    // millisecond
  };
  if (/(y+)/.test(format) || /(Y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
};

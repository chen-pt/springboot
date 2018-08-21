/**
 * Created by admin on 2017/3/6.
 */
$(function () {
  userList();
  $("#user-search-btn").bind("click", function () {
    userList();
  });
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      userList();
    }
  });
});

var userList = function () {//搜索方法
  var username = $("#username").val();
  var realname = $("#realname").val();
  var is_active = $("[name=log_desc]").val();


  $("#user_table").html('');
  AlertLoading($("#user_table"));

  $.ajax({
    async: false,
    type: 'post',
    url: '/merchant/selectall',
    dataType: 'JSON',
    data: {
      "username": username,
      "realname": realname,
      "is_active": is_active,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#user_table").empty();
      if (data.result.list.length > 0) {
        pagination_pages = data.result.pages;
        pagination_totals = data.result.total;
        var tmpHtml = "";
        for (var i = 0; data.result.list.length > i; i++) {
          var manager = data.result.list[i];
          var rolename = "";
          if (manager.roleList.length > 0) {
            for (var j = 0; manager.roleList.length >= j; j++) {
              var role = manager.roleList[j];
              if (role != null) {
                rolename += role.name + ",";
              }
            }
            rolename = rolename.substr(0, rolename.length - 1);
          }
          (manager.isActive == 1) ? a = "开启" : a = "禁用";
          tmpHtml += "<tr><td>" + manager.id + "</td><td>" + manager.username + "</td><td>" + manager.realname + "</td>" +
            "<td>" + rolename + "</td><td>" + manager.cellphone + "</td><td>" + manager.email + "</td><td>"
            + new Date(parseFloat(manager.lastlogintime)).format("yyyy-MM-dd hh:mm:ss") + "</td><td>" + manager.loginCount + "</td>" +
            "<td>" + a + "</td><td><a href='/merchant/add_newuser?managerid=" + manager.id + "&show=1" +
            "'>查看</a><a href='/merchant/add_newuser?managerid=" + manager.id + "&show=0' style='margin-left:6px;'>修改</a></td></tr>";
        }
        $("#user_table").html(tmpHtml);
        $("#user_table").append("<tr><td colspan='10'><span class='pageinfo'></span></td></tr>");

        addpage(userList);
      } else {
        $("#user_table").html("<tr><td colspan='10' class='center'>暂无数据</td></tr>");
        $("#pagediv").html("");
      }
    },
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



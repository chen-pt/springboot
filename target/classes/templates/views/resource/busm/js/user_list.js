/**
 * Created by admin on 2017/3/6.
 */

$(function () {
  userList();
  $("#user-search-btn").bind("click", function () {
    userList();
  });
  $('.page_size_select').live('change', function () {
    userList();
  })
});

var userList = function () {//搜索方法
  var username = $("[name=username]").val();
  var realname = $("[name=realname]").val();
  var is_active = $("[name=is_active]").val();
  AlertLoading($("#user-list"));
  $.ajax({
    async: false,
    type: 'post',
    url: '/jk51b/selectall',
    dataType: 'JSON',
    data: {
      "username": username,
      "realname": realname,
      "is_active": is_active,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#user-list").empty();
      if (data.result.list) {
        pagination_pages = data.result.pages;
        pagination_totals = data.result.total;
        var str = "";
        for (var i = 0; data.result.list.length > i; i++) {
          var manager = data.result.list[i];
          var rolename = "";
          if (manager.roleList && manager.roleList.length > 0) {
            for (var j = 0; manager.roleList.length > j; j++) {
              var role = manager.roleList[j];
              if (role != null) {
                rolename += role.name + ",";
              }
            }
            rolename = rolename.substr(0, rolename.length - 1);
          }
          (manager.isActive == 1) ? a = "开启" : a = "禁用";
          str += "<tr><td>" + manager.id + "</td><td>" + manager.username + "</td><td>" + manager.realname + "</td>" +
            "<td>" + rolename + "</td><td>" + manager.cellphone + "</td><td>" + manager.email + "</td><td>"
            + (new Date(parseFloat(manager.lastLogintime))).format("yyyy-MM-dd hh:mm:ss") + "</td><td>" +
            manager.loginCount + "</td><td>" + a + "</td><td><a class='cat-user' data-toggle='modal' data-target=" +
            "'#user_info' data-keyboard='false'>查看</a><a href='/jk51b/adduser?id=" + manager.id + "' style='margin-left:6px;'>修改</a></td></tr>";
        }
        $("#user-list").append(str);
        $("#pagediv").html("<span class='pageinfo'></span>")
        addpage(userList);
        $(".cat-user").click(function () {
          selectOne(this);
        });

      } else {
        $("#user-list").html("暂无数据");
      }
    },
  })
}

/**
 * 查看某一用户信息
 * @param $btn
 */
var selectOne = function ($btn) {
  $("#show_user").empty();
  var userId = $($btn).parent().parent().children("td:eq(0)").html();
  $.ajax({
    type: "POST",
    url: "/jk51b/selectOne",
    data: {"id": userId},
    dataType: "JSON",
    success: function (data) {
      var manager = data.ybmanager;
      var rolenames = "";
      if (manager.roleList) {
        for (var i = 0; i < manager.roleList.length; i++) {
          rolenames += manager.roleList[i].name + ",";
        }
        rolenames = rolenames.substr(0, rolenames.length - 1);
      }

      var gendle = "";
      if (manager.sex == 1) {
        gendle = "男";
      } else if (manager.sex == 2) {
        gendle = "女";
      } else if (manager.sex = 3) {
        gendle = "保密";
      }
      var remark = "";
      (manager.isActive == 1) ? a = "开启" : a = "禁用";
      if (manager.remark != "NULL") {
        remark = manager.remark;
      }
      (manager.qq == "NULL") ? qq = "" : qq = manager.qq;

      var str = "<div class='control-group'><label for='username'class='control-label v-top'>登录帐号：" +
        "</label ><div class='controls'><div style='padding-top: 3px;'>" + manager.username + "</div></div></div>" +
        "<div class='control-group'><label class='control-label'>姓名：</label><div class='controls'><div style='padding-top: 3px;min-width:117px;'>" +
        "" + manager.realname + "</div></div><label class= 'control-label'>性别：</label><div class='controls' style='padding-top: 3px;'>" + gendle + "</div></div>" +
        "<div class='control-group'><label class='control-label'>手机号码：</label><div class='controls'><div style='padding-top: 3px;'>" +
        "" + manager.cellphone + "</div></div></div>" +
        "<div class='control-group'><label class='control-label'>电子邮箱：" +
        "</label><div class='controls'><div style='padding-top: 3px;min-width:117px;'>" + manager.email + "</div></div><label class='control-label'>QQ：</label><div class='controls'><div style='padding-top: 3px;'>" +
        "" + qq + "</div></div></div>" +
        "<div class='control-group'style='width:100%'><label class='control-label v-top'>角色：" +
        "</label><div class='controls'><div style='padding-top: 3px;'>" + rolenames + "</div></div></div>" +
        "<div class='control-group'><label class='control-label'>备注：</label><div class='controls'><div style='padding-top: 3px;'>" + remark + "</div></div ></div>" +
        "<div class='control-group'><label class='control-label'>状态：</label><div class='controls' style='padding-top: 3px;'>" + a + "</div></div>";
      $("#show_user").append(str);
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



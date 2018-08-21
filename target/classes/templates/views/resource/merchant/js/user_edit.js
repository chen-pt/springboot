/**
 * Created by admin on 2017/3/8.
 */
$(function () {
  rolelist();
  var managerid = GetQueryString("managerid");
  var show = GetQueryString("show");
  if (show != null && show.toString().length > 0) {//show为1：查看；show为0：修改
    $("[name=id]").val(managerid);
    selectOne();
    if (show == 1) {//查看
      $("#add-user-btn").hide();
      $("input").attr("disabled", true);
      $("textarea").attr("disabled", true);
    } else {//修改
      $("[name=username]").attr("disabled", true);
    }
  }
  $("#add-user-btn").click(function () {
    adduser();
  });
});
/**
 * url地址解析
 */
function GetQueryString(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)return unescape(r[2]);
  return null;
}
/**
 * 验证
 */
var checkDataRule = function () {
  $(".sui-msg.msg-error.help-inline").each(function () {
    $(this).remove();
  });
  var canPass = true;
  var id = $("[name=id]").val();
  var rulemanager;
  if (id == '') {
    rulemanager = $('[data-rules]');
  } else {
    rulemanager = $('[data-rules]').not('#notPassword');
  }
  rulemanager.each(function () {
    var rules = $(this).attr("data-rules");
    console.log(this);
    var ruleArr = rules.split("|");
    var tmpArr;
    for (var i in ruleArr) {
      if (ruleArr[i] == "required" && !$(this).val()) {
        var tmpStr = $(this).attr("data-empty-msg") ? $(this).attr("data-empty-msg") : "请填写必填项";
        if ($(this).attr("name") == "classify") {
          $(this).parent().append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>' + tmpStr + '</span></div><i class="msg-icon"></i></div>');
        } else {
          $(this).parent(".controls").append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>' + tmpStr + '</span></div><i class="msg-icon"></i></div>');
        }
        canPass = false;
        break;
      } else {
        tmpArr = ruleArr[i].split("=");
        if (tmpArr[0] == "minlength" && $(this).val().length < tmpArr[1]) {
          $(this).parents(".controls").append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>长度不能少于' + tmpArr[1] + '</span></div><i class="msg-icon"></i></div>');
          canPass = false;
          break;
        }
        if (tmpArr[0] == "maxlength" && $(this).val().length > tmpArr[1]) {
          $(this).parents(".controls").append('<div class="sui-msg msg-error help-inline"><div class="msg-con"><span>长度不能大于' + tmpArr[1] + '</span></div><i class="msg-icon"></i></div>');
          canPass = false;
          break;
        }
      }
    }
  });
  canPass = vali(canPass);
  return canPass;
}
var adduser = function () {
  if (checkDataRule()) {
    $.ajax({
      async: false,
      url: "/merchant/addmanager",
      type: "POST",
      data: $("#newuser_edit").serialize(),
      dataType: "json",
      success: function (data) {
        if (data.status == 1) {
          alert("管理账号已存在，不能注册。");
        } else if (data.result == 1 || data.result == "success") {
          alert("编辑用户成功");
          window.location.href = "/merchant/user_manager";
        }
      },
    });
  }
}
/**
 * 查看用户信息
 */
var selectOne = function () {
  $("#show_user").empty();
  var userId = $("[name=id]").val();
  $.ajax({
      async: false,
      type: "POST",
      url: "/merchant/selectOne",
      data: {"id": userId},
      dataType: "JSON",
      success: function (data) {
        if (data.manager) {
          var manager = data.manager;
          $("[name=id]").val(manager.id);
          $("[name=username]").val(manager.username);
          $("[name=password]").val("");
          $("[name=oldpwd]").val(manager.password);
          $("[name=realname]").val(manager.realname);
          //性别
          $("[name=sex]").each(function () {
            if ($(this).val() == manager.sex) {
              $(this).parent().addClass("checked");
              $(this).attr("checked", true);
            }
          });
          $("[name=cellphone]").val(manager.cellphone);
          $("[name=email]").val(manager.email);
          if (manager.qq != "NULL") {
            $("[name=qq]").val(manager.qq);
          }
          //角色
          $("[name=role_ids]").each(function () {
            if (manager.roleList.length > 0) {
              for (var j = 0; j < manager.roleList.length; j++) {
                if ($(this).val() == manager.roleList[j].id) {
                  $(this).parent().addClass("checked");
                  $(this).attr("checked", true);
                }
              }
            }
          });
          //标记
          if (manager.remark != "NULL") {
            $("[name=remark]").val(manager.remark);
          }

          //状态
          $("[name=isActive]").each(function () {
            if ($(this).val() == manager.isActive) {
              $(this).parent().addClass("checked");
              $(this).attr("checked", true);
            }
          });
        }

      },
    }
  )
}
//角色列表
var rolelist = function () {
  $.ajax({
      async: false,
      url: "/merchant/showrole",
      type: "GET",
      success: function (data) {
        if (data.rolelist) {
          var str = "<tr><td>";
          for (var i = 0; i < data.rolelist.length; i++) {
            str += "<label class='checkbox-pretty inline'><input type='checkbox' name='role_ids'value='" +
              data.rolelist[i].roleId + "'/><span>" + data.rolelist[i].rolename + "</span></label>";
          }
          str += "</td></tr>";
          $(".role_list").append(str);
        } else {
          str = "暂无角色信息";
          $(".role_list").append("str");

        }

      }
    }
  )
}
/**
 * 正则表达式验证
 * @returns {boolean}
 */
var vali = function (canPass) {
  var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;//特殊字符
  var mailpatrn = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;//邮箱验证
  var name = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{6,20}/;//数字和字母的组合
  var phonevali = /^1[0-9]{10}$/;
  if ($(":checkbox[name=role_ids]:checked").size() == 0) {
    alert("请至少选择一个角色！");
    canPass = false;
  } else if (patrn.test($("input[name='username']").val())) {
    alert("用户名不能加入特殊字符");
    canPass = false;
  } else if (patrn.test($("input[name='password']").val())) {
    alert("输入密码不能加入特殊字符");
    canPass = false;
  } else if (!phonevali.test($("input[name='cellphone']").val())) {
    alert("输入的手机号码不合法，请重新输入。");
    canPass = false;
  } else if (!mailpatrn.test($("input[name='email']").val())) {
    alert("邮箱格式不正确，请重新输入");
    canPass = false;
  }
  return canPass;
}



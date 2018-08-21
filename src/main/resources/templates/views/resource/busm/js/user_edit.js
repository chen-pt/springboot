/**
 * Created by admin on 2017/3/8.
 */
var userId = 0;
$(function () {
  showrole();
  userId = window.location.href.split("=")[1];
  if (userId != 0) {
    selectOne(userId);
  } else {
    $("[name=username]").val("");
    $("[name=password]").val("");
  }
  $("#add-user-btn").click(function () {
    adduser();
  });
});
/**
 * 查询用户名是否存在
 * @returns {boolean}
 */
function findbyname() {
  var flag = true;
  $.ajax({
    async: false,
    type: "POST",
    url: "/jk51b/selectall",
    data: {
      "username": $("[name=username]").val(),
    }
    ,
    success: function (data) {
      if (data.result.list.length > 0) {
        alert("该用户名已存在，请重新编辑。");
        flag = false;
      }
    }
  });
  return flag;
}

function showrole() {
  $.ajax({
    type: "POST",
    url: "/jk51b/showrole",
    async: false,
    success: function (data) {
      var role = data.role;
      var tr = "";
      for (var i = 0; i < role.length; i++) {
        tr += "<li style='width: 20%;float: left'><label><input type='checkbox' name='role_ids' value='" + role[i].roleId + "'" +
          "/>&nbsp;" + role[i].rolename + "</label></li>"
      }
      $("#rolelist").append(tr);
    },
    error: function () {
      alert("获取角色列表失败");
    }
  })
}
var adduser = function () {
  console.log($("#edit-user-form").serialize());
  if (checkDataRule()) {
    $.ajax({
      async: false,
      cache: true,
      url: "/jk51b/addYbManager",
      type: "POST",
      data: $("#edit-user-form").serialize(),
      dataType: "json",
      success: function (data) {
        if (data.status == 1) {
          alert("管理账号已存在，不能注册。");
        } else if (data.result == 1 || data.result == "success") {
          alert("编辑用户成功");
          window.location.href = "/jk51b/userlist";
        }
      },
    });
  }
}
var selectOne = function (userId) {
  $.ajax({
      type: "POST",
      url: "/jk51b/selectOne",
      data: {"id": userId},
      dataType: "JSON",
      success: function (data) {
        $("#rolelist").empty();
        if (data.roleList) {
          var str = "";
          for (var i = 0; i < data.roleList.length; i++) {
            str += "<li style='width:20%;float:left'><label><input type='checkbox' name='role_ids'value='" +
              data.roleList[i].roleId + "'/>&nbsp;" + data.roleList[i].rolename + "</label></li>";
          }
        }
        $("#rolelist").append(str);
        var manager = data.ybmanager;
        $("[name=id]").val(manager.id);
        $("[name=username]").val(manager.username);
        $("[name=username]").attr("disabled", true);
        $("[name=oldpwd]").val(manager.password);
        $("[name=realname]").val(manager.realname);
        //性别
        $("[name=sex]").each(function () {
          if ($(this).val() == manager.sex) {
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
          for (var i = 0; i < manager.roleList.length; i++) {
            if ($(this).val() == manager.roleList[i].id) {
              $(this).attr("checked", true);
            }
          }
        });
        if (manager.remark != "NULL") {
          $("[name=remark]").val(manager.remark);
        }
        //状态
        $("[name=isActive]").each(function () {
          if ($(this).val() == manager.isActive) {
            $(this).attr("checked", true);
          }
        });
      },
    }
  )
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
    rulemanager = $('[data-rules]').not('#password');
  }
  rulemanager.each(function () {
    var rules = $(this).attr("data-rules");
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
  var patrn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;//特殊字符
  var mailpatrn = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;//邮箱验证
  var name = /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z]{6,20}/;//数字和字母的组合
  var phonevali = /^1[0-9]{10}$/;
  if (patrn.test($("input[name='username']").val())) {
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
  } else if ($(":checkbox[name=role_ids]:checked").size() == 0) {
    alert("请至少选择一个角色！");
    canPass = false;
  }
  return canPass;
}




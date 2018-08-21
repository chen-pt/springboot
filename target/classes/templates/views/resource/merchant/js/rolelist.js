/**
 * Created by admin on 2017/3/10.
 */
$(function () {
  role_clear();
  getrolelist();
  $(".search-role-btn").click(function () {
    getrolelist();
  });
  $("#save-user-btn").click(function () {
    updateUserOnRole();
  });
  //用户框内搜索
  $(".search-user-btn").click(function () {
    searchuser();
  });
  $("#save-permission-btn").click(function () {
    savepermission();
  });

  //回车搜索
  $(document).keyup(function(event){
    if(event.keyCode ==13){
      getrolelist();
    }
  });
});


/**
 * 获取角色列表
 */
var getrolelist = function () {
  var rolename = $("[name=search_role_name]").val();

  $("#role_table").html('');
  AlertLoading($("#role_table"));
  $.ajax({
    type: "POST",
    url: "/merchant/getRole",
    data: {
      "rolename": rolename,
      "pageNum": pagination_page_no,
      "pageSize": pagination_pagesize,
    },
    success: function (data) {
      $("#role_table").empty();

      var tmpHtml = "";
      if (data.result.list.length > 0) {

        pagination_pages = data.result.pages;
        pagination_totals = data.result.total;

        for (var i = 0; i < data.result.list.length; i++) {
          var roledesc = (data.result.list[i].roleDesc == "null" || data.result.list[i].roleDesc == null) ? "" : data.result.list[i].roleDesc;
          tmpHtml +=
            "<tr><input  type='hidden' name='role-id' value='" + data.result.list[i].roleId + "' rolename='" + data.result.list[i].rolename + "'/><td>" + data.result.list[i].rolename + "</td>" +
            "<td>" + roledesc + "</td>" +
            "<td>" + data.result.list[i].username + "</td>" +
            "<td><a class='edit-role' data-toggle='modal' data-target='#edit-user'data-keyboard='false'>编辑</a>" +
            "<a class='set-role' data-toggle='modal' data-target='#set-role'data-keyboard='false' style='margin:auto 8px;'>权限</a>" +
            "<a class='set-user' data-toggle='modal' data-target='#user-manager'data-keyboard='false'>用户</a>" +
            "<a class='del-role'style='margin-left:8px;'>删除</a></td></tr>";
        }

      } else {
        tmpHtml = "<tr><td colspan='4' class='center'>暂无数据</td></tr>";
      }
      $("#role_table").html(tmpHtml);
      $("#pagediv").html("<span class='pageinfo'></span>");

      addpage(getrolelist);
      //编辑角色信息
      $(".edit-role").click(function () {
        role_edit_show(this);
      });
      //编辑用户的权限
      $(".set-role").click(function () {
        permission_list(this);
      });
      $(".set-user").click(function () {
        $("#save-user-btn").attr("data-id", $(this).parents("tr").find('[name="role-id"]').val());
        $("#save-user-btn").attr("data-name", $(this).parents("tr").find('[name="role-id"]').attr("rolename"));
        setuserlist(this);
      });
      $(".del-role").click(function () {
        delRoleById(this);
      });
    },
  })
}
/**
 * 单一角色信息显示
 */
var role_edit_show = function ($edit_btn) {
  var roleid = $($edit_btn).parent().parent().find("input").val();
  var rolename = $($edit_btn).parent().parent().find("td:eq(0)").html();
  var roleDesc = $($edit_btn).parent().parent().find("td:eq(1)").html();
  $("[name=role_id]").val(roleid);
  $("[name=role_name]").val(rolename);
  $("[name=role_desc]").html(roleDesc);
  $("[name=role_desc]").next('span').html($("[name=role_desc]").val().length);
}
/**
 * 表单清空
 */
var role_clear = function () {
  $("[name=role_id]").val("");
  $("[name=role_name]").val("");
  $("[name=role_desc]").html("");
}
/**
 * 新增或修改确定按钮点击
 */
var edit_role = function () {
  var url = "";
  var id = $("[name=role_id]").val();
  var name = $("[name=role_name]").val();
  var desc = $("[name=role_desc]").val();
  if (id != null && id != "") {
    //这是修改角色信息
    url = "updateRole";
  } else {
    url = "addrole";
  }
  var u = "/merchant/" + url;
  $.ajax({
    type: "POST",
    url: u,
    data: {
      "id": id,
      "role_name": name,
      "role_desc": desc
    },
    dataType: "JSON",
    success: function (data) {
      window.location.href = "/merchant/role_manager";
    },
  });

}

/**
 * 权限列表显示+角色权限
 */

var permission_list = function ($btn) {
  $("#permissions").empty();
  var roleid = $($btn).parent().parent().find("input").val();
  var rolename = $($btn).parent().parent().find("input").attr("rolename");
  $("#set-permission-form").find("[name=roleId]").val(roleid);
  $("#set-permission-form").find("[name=rolename]").val(rolename);
  $.ajax({
    type: "POST",
    url: "/merchant/roleAndPermissions",
    data: {"id": roleid},
    datatype: "json",
    success: function (data) {
      var permissionTypes = data.permissionType;
      var permissions = data.permissions;
      var roleHasPermissions = data.roleHasPermissions;
      var ss = "";
      $.each(permissionTypes, function (n, permissionType) {
        var tr = "<tr> <td><label class='permission-group-label'><input type='checkbox'value='" + permissionType.id + "' class='pertype'/> " + permissionType.name + "</label></td><td id='permission-group-28'>";
        $.each(permissions, function (m, permission) {
            if (permissionType.id == permission.typeId || permissionType.id == permission.type_id) {
              tr += "<label class='permission-label'><input type='checkbox'name='role_permission' value='" + permission.id + "'/>" + permission.name + "</label>";
            }
          }
        );
        tr += "</td></tr>";
        ss += tr;
      });
      $("#permissions").append(ss);
      $(".pertype").bind('click', function () {
        var checked_type = this.checked;
        var input_arr = $(this).parent().parent().next().find("input");
        $.each(input_arr, function (i, dom) {
          $(dom).prop('checked', checked_type);
        });
      });

      $.each(roleHasPermissions, function (o, roleHasPermission) {
        $("[name=role_permission] ").each(function () {
          if ($(this).val() == roleHasPermission.id) {
            $(this).attr("checked", true);
          }
        });
      });
      eachLabel(permissionTypes);
    },
  });
}
/**
 * 修改该角色的权限信息
 */
var savepermission = function () {
  var roleId = $("#set-permission-form").find("[name=roleId]").val();
  var role_permissions = "";
  $.each($("[name=role_permission]"), function (c, uid) {
    if ($(uid).is(':checked')) {
      role_permissions += $(uid).val() + ",";
    }
  })
  $.ajax({
    type: "POST",
    dataType: "JSON",
    url: "/merchant/addPermissiononRole",
    data: {
      "roleId": roleId,
      "role_permissions": role_permissions
    },
    success: function (data) {
      window.location.href = "/merchant/role_manager";
    }

    ,
  })

}

/**
 * 加载用户选项框
 * 该平台的所有用户+该角色具有那些用户
 */

var setuserlist = function ($btn) {
  $("[name=search_input]").val("");
  $(".user_list").empty();
  $(".select_user_list").empty();
  var roleid = $($btn).parent().parent().find("input").val();
  $("#user-manager").find("[name=role_id]").val(roleid);
  $.ajax({
    type: "POST",
    url: "/merchant/selectUserByRole",
    data: {
      "roleId": roleid,
    },
    success: function (data) {
      var managerlist = data.managerList;
      var managerli = "";
      var i = 0;
      var j = 0;
      var selectmanagerli = "";
      $.each(managerlist, function (e, manager) {
        managerli += "<option value='" + manager.id + "'>" + manager.username + "</option>";
        i++;
        if (manager.roleList.length > 0) {
          $.each(manager.roleList, function (n, role) {
            if (role.id == roleid) {
              selectmanagerli += "<option title='双击移除' value='" + manager.id + "'>" + manager.username + "</option>";
              j++;
            }
          })
        }
      });
      $(".user_list").append(managerli);
      $(".total_user_num").html(i);
      $(".select_user_list").append(selectmanagerli);
      $(".total_select_user_num").html(j);
    },
  })
}
/**
 * 用户框搜索
 */
function searchuser() {
  var inputname = $("[name=search_input]").val();
  $.ajax({
    type: "POST",
    url: "/merchant/selectuserbyname",
    data: {
      "username": inputname
    },
    success: function (data) {
      $(".user_list").empty();
      var managerlist = data.managerList;
      var managerli = "";
      if (managerlist.length > 0) {
        $.each(managerlist, function (e, manager) {
          managerli += "<option value='" + manager.id + "'>" + manager.username + "</option>";
        });
      }
      $(".user_list").append(managerli);
    },
  });
}


/**
 * 更改角色拥有的用户
 */
var updateUserOnRole = function () {
  var id = $("#save-user-btn").attr("data-id");
  var rolename = $("#save-user-btn").attr("data-name");
  var ss = "";
  var array = [];
  $(".select_user_list option").each(function () {  //遍历所有option
    var txt = $(this).val();   //获取option值
    if (txt != '') {
      ss += txt + ",";
      array.push(txt);  //添加到数组中
    }
  });
  var data = {};
  data.role_id = id;
  data.rolename = rolename;
  if (array.length > 0) {
    data.user_ids = ss;
  }
  $.ajax({
    type: "POST",
    url: "/merchant/updateUserOnRole",
    data: data,
    dataType: "JSON",
    success: function (data) {
      alert("更改角色用户成功");
      window.location.href = "/merchant/role_manager";
    },
    error: function () {
      alert("更改失败");
    }
  })
}

/**
 * 删除对应角色
 */
var delRoleById = function ($delBtn) {
  var roleid = $($delBtn).parent().parent().find("input").val();
  $.ajax({
    type: "POST",
    url: "/merchant/delRole",
    data: {"roleId": roleid},
    success: function (data) {
      alert("删除成功");
      window.location.href = "/merchant/role_manager";
    },
    error: function () {
      alert("删除失败");
    }
  })

}
function eachLabel(arr) {
  for (var i = 0; i < arr.length; i++) {
    var all_td = $('#permissions').children('tr')[i];
    var all_input = $(all_td).children('td').eq(1).find('input');
    var selected = 0;
    for (var s = 0; s < all_input.length; s++) {
      if (all_input[s].checked) {
        selected += 1;
      }
    }
    if (selected == all_input.length && selected != 0) {
      $(all_td).find('.pertype').attr('checked', true);
    }
  }
}




